import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || ''; // Ensure key exists or handle gracefully
const ai = new GoogleGenAI({ apiKey });

export const analyzeFinances = async (prompt: string, contextData: string) => {
  if (!apiKey) {
    return "AI Assistant is unavailable (Missing API Key).";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        User context data (JSON): ${contextData}
        
        User Query: ${prompt}
      `,
      config: {
        systemInstruction: "You are Nova, a helpful and knowledgeable financial assistant for the Fintech Nova app. You MUST strictly answer in English. Keep answers concise, friendly, and focused on financial well-being. Use USD ($) and EUR (€) for currency examples. Do not mention BRL or Portuguese terms.",
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the financial brain right now. Please try again later.";
  }
};