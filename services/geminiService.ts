import { GoogleGenAI } from "@google/genai";
import { GenerationConfig, GeneratedImage } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-image';
const TEXT_MODEL_NAME = 'gemini-2.5-flash';

export const enhancePrompt = async (originalPrompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: `You are an expert AI prompt engineer. Rewrite the following user prompt to be highly descriptive, detailed, and optimized for an AI image generator. 
      Focus on visual elements like lighting, texture, camera angle, artistic style, and composition. 
      Make the prompt vivid but concise (under 100 words).
      Do not add conversational filler. Return ONLY the enhanced prompt text.
      
      User Prompt: "${originalPrompt}"`,
    });

    return response.text ? response.text.trim() : originalPrompt;
  } catch (error) {
    console.error("Enhance Prompt Error:", error);
    throw error;
  }
};

export const generateImage = async (config: GenerationConfig): Promise<GeneratedImage> => {
  try {
    const { prompt, style, aspectRatio, referenceImage, referenceMimeType } = config;

    // Construct the prompt with style modifiers
    let finalPrompt = prompt;
    if (style && style !== 'none') {
      finalPrompt = `${prompt}, in ${style} style, high quality, 8k resolution, highly detailed`;
    }

    // Build contents part
    const parts: any[] = [];

    // If we have a reference image, this is an EDIT operation (or Image-to-Image)
    if (referenceImage && referenceMimeType) {
      // Remove data URL prefix if present for the API call
      const base64Data = referenceImage.split(',')[1] || referenceImage;
      
      parts.push({
        inlineData: {
          mimeType: referenceMimeType,
          data: base64Data
        }
      });
      
      // For editing, the prompt instructs WHAT to do to the image
      parts.push({
        text: finalPrompt
      });
    } else {
      // Text-to-Image generation
      parts.push({
        text: finalPrompt
      });
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          // note: imageSize is not supported in 2.5 flash image, only on 3-pro-image-preview
        }
      }
    });

    // Extract image from response
    let generatedBase64 = '';
    
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!generatedBase64) {
      throw new Error("No image generated. The model might have returned text instead.");
    }

    return {
      id: crypto.randomUUID(),
      data: generatedBase64,
      mimeType: "image/png", // Gemini usually returns PNG
      prompt: finalPrompt,
      timestamp: Date.now()
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
