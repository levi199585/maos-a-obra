
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIAssistance = async (description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `O cliente descreveu o seguinte problema de manutenção/construção: "${description}". 
      Por favor, refine essa descrição para torná-la profissional e clara para um prestador de serviço. 
      Sugira também qual categoria de profissional é mais adequada (Pedreiro, Eletricista, Encanador, Pintor, Carpinteiro, Gesseiro, Jardineiro, Limpeza).
      Retorne em formato JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinedDescription: { type: Type.STRING },
            suggestedCategory: { type: Type.STRING },
            estimatedComplexity: { type: Type.STRING }
          },
          required: ["refinedDescription", "suggestedCategory", "estimatedComplexity"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Assistance error:", error);
    return null;
  }
};
