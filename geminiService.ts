
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getBuildingIdea = async (context: string): Promise<GeminiResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user is playing a Minecraft-like game. Suggest a small structure to build. 
      Context provided: ${context}.
      Return the response in JSON format including a text 'idea' and a 'blueprint' which is an array of blocks with positions [x, y, z] and texture type ('dirt', 'grass', 'glass', 'wood', 'log', 'cobblestone').
      Keep blueprints small (max 10-15 blocks) to avoid overwhelming the scene.
      Center positions around [0, 1, 0].`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            idea: { type: Type.STRING },
            blueprint: {
              type: Type.OBJECT,
              properties: {
                blocks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pos: {
                        type: Type.ARRAY,
                        items: { type: Type.NUMBER },
                        minItems: 3,
                        maxItems: 3
                      },
                      texture: { 
                        type: Type.STRING,
                        description: "one of: dirt, grass, glass, wood, log, cobblestone"
                      }
                    },
                    required: ["pos", "texture"]
                  }
                }
              },
              required: ["blocks"]
            }
          },
          required: ["idea"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return { idea: "Error connecting to Gemini. Try building a small hut!" };
  }
};
