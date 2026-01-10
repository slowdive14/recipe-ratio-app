'use server';

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject, APICallError } from 'ai';
import { z } from 'zod';
import { IngredientUnit, FractionValue } from '@/types';

const fractionEnum = z.enum(['1/8', '1/4', '1/3', '1/2', '2/3', '3/4']);

const ingredientSchema = z.object({
  name: z.string().describe('재료 이름'),
  amount: z.number().describe('수량 (정수 부분, 양이 명시되지 않은 경우 0)'),
  fraction: fractionEnum
    .nullable()
    .optional()
    .describe('분수 부분 (없으면 필드를 생략하거나 null)'),
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

## 규칙

### 기본 규칙
- 이미지가 레시피가 아닌 경우에도 음식 관련 내용이 있다면 최대한 레시피 형태로 정리해주세요.
- 제공량이 명시되지 않은 경우 1인분으로 설정하세요.
- 여러 레시피가 있다면 가장 눈에 띄는 하나만 추출하세요.

### 재료 추출 규칙
- 재료의 양은 정수 부분(amount)과 분수 부분(fraction)으로 나누어 추출하세요.
- 분수 부분이 없으면 fraction 필드를 생략하거나 null로 설정하세요.
- 양이 전혀 명시되지 않은 경우 amount를 0으로 설정하세요.
- 단위는 반드시 제공된 옵션 중에서 선택하고, 한국어로 변환하세요.

### 단위 변환 예시
- g, gram → 그램
- ml → 밀리리터
- tsp, teaspoon → 티스푼
- tbsp, tablespoon → 테이블스푼
- cup → 컵
- pinch → 꼬집
- ea, 개, 알 → 개

### 추출 예시
- "밀가루 2컵" → { "name": "밀가루", "amount": 2, "unit": "컵" }
- "설탕 1과 1/2컵" → { "name": "설탕", "amount": 1, "fraction": "1/2", "unit": "컵" }
- "소금 약간" → { "name": "소금", "amount": 1, "unit": "꼬집" }
- "계란" (양 없음) → { "name": "계란", "amount": 0, "unit": "개" }`,
            },
          ],
        },
      ],
    });

    const rawRecipe = result.object;
    const recipe: ExtractedRecipe = {
      name: rawRecipe.name,
      description: rawRecipe.description,
      servings: rawRecipe.servings,
      ingredients: rawRecipe.ingredients.map((ing) => ({
        name: ing.name,
        amount: ing.amount,
        fraction: (ing.fraction ?? '') as FractionValue,
        unit: ing.unit as IngredientUnit,
      })),
    };

    return {
      success: true,
      recipe,
    };
  } catch (error) {
    console.error('Error extracting recipe from image:', error);

    if (error instanceof APICallError) {
      const status = error.statusCode;

      if (status === 401 || status === 403) {
        return {
          success: false,
          error: 'API 키가 올바르지 않거나 권한이 없습니다. Google AI Studio에서 키를 확인해주세요.',
        };
      }

      if (status === 429) {
        return {
          success: false,
          error: '무료 사용량을 초과했습니다. 잠시 후 다시 시도해주세요.',
        };
      }

      if (status === 400) {
        return {
          success: false,
          error: '이미지 형식이 올바르지 않습니다. 다른 이미지를 시도해주세요.',
        };
      }

      return {
        success: false,
        error: `API 오류가 발생했습니다. (${status ?? 'unknown'})`,
      };
    }

    const errorMessage = error instanceof Error ? error.message : '';
    
    if (errorMessage.includes('No object generated')) {
      return {
        success: false,
        error: '이미지에서 레시피 정보를 추출할 수 없습니다. 레시피가 명확하게 보이는 이미지를 사용해주세요.',
      };
    }

    return {
      success: false,
      error: errorMessage || '레시피 추출 중 오류가 발생했습니다.',
    };
  }
}
