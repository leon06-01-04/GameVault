import { GoogleGenAI, Type } from "@google/genai";
import { GameAISuggestion } from "../types";

export const suggestGameDetails = async (gameTitle: string): Promise<GameAISuggestion | null> => {
  if (!gameTitle.trim()) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-flash-preview for fast text generation
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a concise description (under 100 words) and the primary genre for the video game titled "${gameTitle}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: "A short summary of the game's premise and gameplay.",
            },
            genre: {
              type: Type.STRING,
              description: "The primary genre of the game (e.g., RPG, FPS, Platformer).",
            },
          },
          required: ["description", "genre"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) return null;

    return JSON.parse(jsonText) as GameAISuggestion;
  } catch (error) {
    console.error("Error fetching game suggestion from Gemini:", error);
    return null;
  }
};