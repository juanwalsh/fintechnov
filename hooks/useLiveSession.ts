import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { MOCK_TRANSACTIONS, MOCK_USER } from '../mocks/data';

// Audio util helpers
const floatTo16BitPCM = (input: Float32Array) => {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return output;
};

const base64ToUint8Array = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const useLiveSession = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for audio handling
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);

  const disconnect = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;

    setIsConnected(false);
    setIsSpeaking(false);
  }, []);

  const connect = useCallback(async () => {
    try {
      setError(null);
      
      // 1. Request Mic Permission FIRST (Must be triggered by user action to avoid Permission Denied)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      const ai = new GoogleGenAI({ apiKey });

      // Initialize Audio Context
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = ctx;
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      nextStartTimeRef.current = ctx.currentTime;

      // Setup Source & Processor immediately
      sourceRef.current = ctx.createMediaStreamSource(stream);
      processorRef.current = ctx.createScriptProcessor(4096, 1, 1);
      
      processorRef.current.connect(ctx.destination);
      sourceRef.current.connect(processorRef.current);

      // Prepare Context Data
      const contextData = JSON.stringify({
        user: MOCK_USER,
        recent_transactions: MOCK_TRANSACTIONS.slice(0, 5)
      });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `
            You are Nova, an advanced interactive financial voice assistant.
            USER DATA: ${contextData}
            TONE: Professional, crisp, intelligent. Be concise.
          `,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } 
          }
        },
        callbacks: {
          onopen: async () => {
            console.log("Gemini Live Session Opened");
            setIsConnected(true);

            // Hook up the audio processor to send data
            if (processorRef.current) {
                processorRef.current.onaudioprocess = (e) => {
                  const inputData = e.inputBuffer.getChannelData(0);
                  const pcm16 = floatTo16BitPCM(inputData);
                  const base64Data = arrayBufferToBase64(pcm16.buffer);
                  // Ensure we use the active session promise
                  sessionPromise.then(session => {
                     session.sendRealtimeInput({
                       media: { mimeType: 'audio/pcm;rate=16000', data: base64Data }
                     });
                  });
                };
            }
          },
          onmessage: async (msg: LiveServerMessage) => {
             const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (audioData) {
               setIsSpeaking(true);
               const ctx = audioContextRef.current;
               if (!ctx) return;

               const audioBytes = base64ToUint8Array(audioData);
               const float32Data = new Float32Array(audioBytes.length / 2);
               const dataView = new DataView(audioBytes.buffer);
               for (let i = 0; i < float32Data.length; i++) {
                 float32Data[i] = dataView.getInt16(i * 2, true) / 32768.0;
               }

               const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000);
               audioBuffer.getChannelData(0).set(float32Data);

               const source = ctx.createBufferSource();
               source.buffer = audioBuffer;
               
               // Connect to Analyser AND Destination
               if (analyserRef.current) {
                 source.connect(analyserRef.current);
                 analyserRef.current.connect(ctx.destination);
               } else {
                 source.connect(ctx.destination);
               }
               
               const startTime = Math.max(ctx.currentTime, nextStartTimeRef.current);
               source.start(startTime);
               nextStartTimeRef.current = startTime + audioBuffer.duration;
               
               source.onended = () => {
                 setTimeout(() => {
                   if (ctx.currentTime >= nextStartTimeRef.current) setIsSpeaking(false);
                 }, 100);
               };
             }
          },
          onclose: () => {
            setIsConnected(false);
            setIsSpeaking(false);
          },
          onerror: (err) => {
            console.error(err);
            setError("Connection error");
            disconnect();
          }
        }
      });
      sessionRef.current = sessionPromise;
    } catch (err: any) {
      console.error("Connection Failed", err);
      if (err.name === 'NotAllowedError' || err.message?.includes('Permission') || err.message?.includes('denied')) {
         setError("Microphone permission denied. Please allow access.");
      } else {
         setError("Failed to connect");
      }
      disconnect();
      setIsConnected(false);
    }
  }, [disconnect]);

  return { connect, disconnect, isConnected, isSpeaking, error, analyser: analyserRef.current };
};