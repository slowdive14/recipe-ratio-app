'use server';

import { experimental_generateImage as generateImage } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { uploadImageToStorage } from '@/lib/firebase-admin';
import { generateRecipePrompt } from '@/lib/prompt';

const FALLBACK_IMAGE_URL = '/images/placeholder-food.svg';

interface GenerateRecipeImageResult {
  success: boolean;
  imageUrl: string;
  error?: string;
}

export async function generateRecipeImage(
  title: string,
  description?: string
): Promise<GenerateRecipeImageResult> {
  try {
    // Check if API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('GOOGLE_GENERATIVE_AI_API_KEY is not configured');
      return {
        success: false,
        imageUrl: FALLBACK_IMAGE_URL,
        error: 'API key not configured',
      };
    }

    // Generate prompt
    const prompt = generateRecipePrompt(title, description);

    // Create Google AI provider
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    // Use Imagen 3 for image generation
    const result = await generateImage({
      model: google.image('imagen-3.0-generate-002'),
      prompt: prompt,
      size: '1024x1024',
      providerOptions: {
        google: {
          aspectRatio: '1:1',
        },
      },
    });

    // Get the generated image
    const image = result.image;

    if (!image || !image.base64) {
      console.error('No image generated from Imagen');
      return {
        success: false,
        imageUrl: FALLBACK_IMAGE_URL,
        error: 'No image generated',
      };
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(image.base64, 'base64');

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const filename = `${timestamp}_${randomStr}.png`;

    // Upload to Firebase Storage
    const publicUrl = await uploadImageToStorage(buffer, filename);

    return {
      success: true,
      imageUrl: publicUrl,
    };
  } catch (error) {
    console.error('Error generating recipe image:', error);
    return {
      success: false,
      imageUrl: FALLBACK_IMAGE_URL,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
