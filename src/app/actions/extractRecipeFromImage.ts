'use server';

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { IngredientUnit, FractionValue } from '@/types';

const ingredientSchema = z.object({
  name: z.string().describe('재료 이름'),
  amount: z.number().describe('수량 (정수 부분)'),
  fraction: z
    .enum(['1/8', '1/4', '1/3', '1/2', '2/3', '3/4', ''])
    .describe('분수 부분 (없으면 빈 문자열)'),
  unit: z
    .enum([
      '그램',
      '개',
      '밀리리터',
      '꼬집',
      '리터',
      '티스푼',
      '테이블스푼',
      '컵',
      '파운드',
      '온스',
      '파인트',
      '쿼트',
      '액량 온스',
      '갤런',
    ])
    .describe('단위'),
});

const recipeSchema = z.object({
  name: z.string().describe('레시피 이름'),
  description: z.string().describe('레시피에 대한 간단한 설명'),
  servings: z.number().describe('제공량 (인분)'),
  ingredients: z.array(ingredientSchema).describe('재료 목록'),
});

export interface ExtractedIngredient {
  name: string;
  amount: number;
  fraction: FractionValue;
  unit: IngredientUnit;
}

export interface ExtractedRecipe {
  name: string;
  description: string;
  servings: number;
  ingredients: ExtractedIngredient[];
}

export interface ExtractRecipeResult {
  success: boolean;
  recipe?: ExtractedRecipe;
  error?: string;
}

export async function extractRecipeFromImage(
  imageBase64: string,
  mimeType: string,
  apiKey: string
): Promise<ExtractRecipeResult> {
  try {
    if (!apiKey) {
      return {
        success: false,
        error: 'API 키가 설정되지 않았습니다.',
      };
    }

    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    const result = await generateObject({
      model: google('gemini-2.5-flash-lite'),
      schema: recipeSchema,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              image: `data:${mimeType};base64,${imageBase64}`,
            },
            {
              type: 'text',
              text: `이 이미지에서 레시피 정보를 추출해주세요.

이미지가 레시피가 아닌 경우에도 음식 관련 내용이 있다면 최대한 레시피 형태로 정리해주세요.
재료의 양은 정수 부분과 분수 부분으로 나누어 추출하세요.
단위는 반드시 제공된 옵션 중에서 선택하고, 한국어로 변환하세요 (예: g → 그램, ml → 밀리리터, tsp → 티스푼, tbsp → 테이블스푼).
제공량이 명시되지 않은 경우 1인분으로 설정하세요.`,
            },
          ],
        },
      ],
    });

    return {
      success: true,
      recipe: result.object as ExtractedRecipe,
    };
  } catch (error) {
    console.error('Error extracting recipe from image:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : '레시피 추출 중 오류가 발생했습니다.',
    };
  }
}
