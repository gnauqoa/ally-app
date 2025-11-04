import { GoogleGenAI } from "@google/genai";

export const aiClient = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_AI_KEY,
});

