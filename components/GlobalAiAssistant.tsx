import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Mic, MicOff, X, Send, User as UserIcon, Sparkles, MessageSquare, Headphones } from 'lucide-react';
import { useLiveSession } from '../hooks/useLiveSession';
import { analyzeFinances } from '../services/geminiService';
import { useAuth } from '../App';
import * as api from '../services/api';
import Button from './ui/Button';

// Canvas Visualizer Component
const AudioVisualizer = ({ analyser, isSpeaking }: { analyser: AnalyserNode | null, isSpeaking: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !analyser) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let animationId: number;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2; // Scale down

        // Gradient color based on height
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#35E3FF');
        gradient.addColorStop(1, '#3B74FF');
        
        ctx.fillStyle = gradient;
        
        // Draw rounded bars
        if (barHeight > 0) {
           ctx.fillRect(x, canvas.height / 2 - barHeight / 2, barWidth, barHeight);
        }

        x += barWidth + 1;
      }
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [analyser, isSpeaking]);

  return <canvas ref={canvasRef} width={300} height={100} className="w-full h-24" />;
};

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const GlobalAiAssistant: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'chat' | 'voice'>('chat');
  
  // Voice State
  const { connect, disconnect, isConnected, isSpeaking, error, analyser } = useLiveSession();
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Greeting dynamically
  useEffect(() => {
    if (user && messages.length === 0) {
      setMessages([
        {
          id: 'init',
          sender: 'ai',
          text: `Hello ${user.name.split(' ')[0]}! I'm Nova. How can I help with your finances today?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [user]);

  // Auto-scroll chat
  useEffect(() => {
    if (mode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, mode, isOpen]);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleModeSwitch = (newMode: 'chat' | 'voice') => {
    setMode(newMode);
    if (newMode === 'chat' && isConnected) {
      disconnect();
    } else if (newMode === 'voice' && !isConnected) {
      connect();
    }
  };

  const handleTextSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Prepare context with real fresh data
    const txs = await api.getTransactions();
    const context = JSON.stringify({
      user: user,
      recent_transactions: txs.slice(0, 8),
      total_balance: user?.balance
    });

    const response = await analyzeFinances(userMsg.text, context);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: response || "I'm having trouble connecting right now.",
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMsg]);
  };

  if (!user) return null; // Don't show if not logged in

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className={`fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-gray-800 text-white' : 'bg-gradient-to-tr from-primary to-accent text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <Bot size={28} />}
        {isConnected && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </motion.button>

      {/* Expanded Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-4 md:right-6 z-[60] w-[90vw] md:w-96 h-[500px] glass-panel bg-white/95 dark:bg-[#111B2E]/95 rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-black/20 shrink-0">
               <div className="flex items-center space-x-2">
                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                   <Bot size={18} />
                 </div>
                 <div>
                   <h3 className="font-bold text-sm text-gray-900 dark:text-white">Nova AI</h3>
                   <p className="text-[10px] text-gray-500 flex items-center">
                     <span className={`w-1.5 h-1.5 rounded-full mr-1 ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></span> 
                     {mode === 'voice' ? 'Voice Session' : 'Chat Assistant'}
                   </p>
                 </div>
               </div>
          
               {/* Mode Switcher */}
               <div className="flex bg-gray-200 dark:bg-white/10 rounded-full p-1">
                 <button 
                   onClick={() => handleModeSwitch('chat')}
                   className={`p-1.5 rounded-full transition-all ${mode === 'chat' ? 'bg-white dark:bg-black/40 shadow-sm text-primary' : 'text-gray-500'}`}
                 >
                   <MessageSquare size={16} />
                 </button>
                 <button 
                   onClick={() => handleModeSwitch('voice')}
                   className={`p-1.5 rounded-full transition-all ${mode === 'voice' ? 'bg-white dark:bg-black/40 shadow-sm text-primary' : 'text-gray-500'}`}
                 >
                   <Headphones size={16} />
                 </button>
               </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative bg-gray-50/30 dark:bg-black/20">
              {mode === 'chat' ? (
                <div className="h-full flex flex-col">
                  {/* Message List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                          msg.sender === 'user' 
                            ? 'bg-primary text-white rounded-tr-none' 
                            : 'bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                       <div className="flex justify-start">
                         <div className="bg-white dark:bg-[#1E293B] border border-gray-100 dark:border-white/5 rounded-2xl rounded-tl-none p-3 shadow-sm">
                           <div className="flex space-x-1">
                             <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                             <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                             <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                           </div>
                         </div>
                       </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <form onSubmit={handleTextSend} className="p-3 bg-white dark:bg-[#111B2E] border-t border-gray-100 dark:border-white/5 flex items-center gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask about your spending..."
                      className="flex-1 bg-gray-100 dark:bg-black/20 border-0 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white"
                    />
                    <button 
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="p-2.5 bg-primary text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              ) : (
                /* Voice Mode UI */
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="relative mb-8 w-full flex items-center justify-center h-32">
                     {isConnected ? (
                       <AudioVisualizer analyser={analyser} isSpeaking={isSpeaking} />
                     ) : (
                       <motion.div 
                         animate={{ scale: [1, 1.1, 1] }}
                         transition={{ repeat: Infinity, duration: 2 }}
                         className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
                       >
                         <Mic size={40} className="text-primary opacity-50" />
                       </motion.div>
                     )}
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {isConnected ? (isSpeaking ? "Nova is speaking..." : "Listening...") : "Voice Mode"}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-[200px]">
                    {isConnected 
                      ? "Speak naturally. Nova is analyzing your request." 
                      : "Tap the microphone to start a real-time voice session."}
                  </p>
                  
                  {error && (
                    <div className="mb-4 text-xs text-red-500 bg-red-500/10 px-3 py-1 rounded-full">
                      {error}
                    </div>
                  )}

                  <Button 
                    onClick={isConnected ? disconnect : connect}
                    className={`w-full py-3 rounded-xl flex items-center justify-center space-x-2 transition-all ${
                      isConnected 
                        ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                        : 'bg-primary hover:bg-blue-600 shadow-primary/20'
                    }`}
                  >
                    {isConnected ? <MicOff size={20} /> : <Mic size={20} />}
                    <span>{isConnected ? 'End Session' : 'Start Conversation'}</span>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalAiAssistant;