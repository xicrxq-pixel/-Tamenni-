
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the Google GenAI SDK with the API key from environment variables.
// Following the guideline: Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates friendly and empathetic health advice in Arabic based on user-provided symptoms and details.
 * Uses gemini-3-flash-preview which is suitable for basic text tasks.
 */
export const generateHealthAdvice = async (symptom: string, details: string): Promise<string> => {
  const prompt = `User is experiencing ${symptom}. Details: ${details}. Provide a friendly, empathetic health advice in Arabic. Focus on simple home remedies and when to see a doctor. Keep it short and supportive. Use 'طمني' as your persona. IMPORTANT: Add a medical disclaimer stating you are an AI assistant and not a doctor.`;
  
  try {
    // Calling generateContent with the model name and prompt directly as per guidelines.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Extracting generated text using the .text property from GenerateContentResponse.
    return response.text || "عذراً، لم أستطع تحليل المعلومات حالياً.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "حدث خطأ أثناء محاولة مساعدتك. يرجى المحاولة لاحقاً.";
  }
};

/**
 * Edits an image using text prompts by leveraging the gemini-2.5-flash-image model.
 * @param base64Data The base64 encoded string of the source image.
 * @param prompt The user's editing instructions.
 * @param mimeType The IANA standard MIME type of the image.
 * @returns The base64 encoded string of the edited image or null if an error occurs.
 */
export const editImageWithGemini = async (base64Data: string, prompt: string, mimeType: string): Promise<string | null> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Iterating through all parts to find the resulting image part, as it might not be the first one.
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          const resultMimeType = part.inlineData.mimeType || 'image/png';
          return `data:${resultMimeType};base64,${base64EncodeString}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Editing Error:", error);
    return null;
  }
};
