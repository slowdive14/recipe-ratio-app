'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecipeStore } from '@/store/recipeStore';
import {
  RecipeBasicForm,
  IngredientForm,
  ImageUploader,
  RecipeScanner,
} from '@/components/recipe';
import { Button } from '@/components/ui';
import { OvenSetting, Ingredient } from '@/types';
import { ExtractedRecipe } from '@/app/actions/extractRecipeFromImage';
import { generateId } from '@/lib/utils';

export default function NewRecipePage() {
  const router = useRouter();
  const { addRecipe } = useRecipeStore();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState<ExtractedRecipe | null>(null);
  const formRef = useRef<{ reset: (data: ExtractedRecipe) => void } | null>(null);

  const handleSubmit = async (data: {
    name: string;
    description: string;
    categoryId: string;
    servings: number;
    ovenSettings: OvenSetting[];
  }) => {
    setSaving(true);

    try {
      const id = await addRecipe({
        ...data,
        imageUrl,
        ingredients,
      });
      router.push(`/recipes/${id}`);
    } catch (error) {
      console.error('Error saving recipe:', error);
      setSaving(false);
    }
  };

  const handleRecipeExtracted = (recipe: ExtractedRecipe) => {
    setScannedData(recipe);
    setShowScanner(false);

    const ingredientsWithIds: Ingredient[] = recipe.ingredients.map((ing) => ({
      id: generateId(),
      name: ing.name,
      amount: ing.amount,
      fraction: ing.fraction,
      unit: ing.unit,
    }));
    setIngredients(ingredientsWithIds);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div className="flex items-center gap-4">
          <span className="text-4xl animate-float">✨</span>
          <h1 className="text-3xl font-['Jua'] text-[var(--color-text)]">새 레시피</h1>
        </div>
        <Link
          href="/recipes"
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-white border-3 border-[var(--color-peach-light)] text-[var(--color-text)] font-['Jua'] text-sm hover:bg-[var(--color-peach-light)] hover:border-[var(--color-peach)] hover:scale-105 transition-all duration-300"
        >
          취소
        </Link>
      </div>

      {/* 사진 스캔 버튼 */}
      <button
        type="button"
        onClick={() => setShowScanner(true)}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#E67E22] to-[#F39C12] text-white rounded-2xl font-['Jua'] text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-slide-up"
      >
        <span className="text-2xl">📷</span>
        레시피 사진으로 자동 입력
      </button>

      {/* 기본 정보 */}
      <div className="bg-white rounded-[28px] border-3 border-[var(--color-peach-light)] shadow-[var(--shadow-card)] p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <RecipeBasicForm
          key={scannedData ? `scanned-${scannedData.name}` : 'default'}
          initialData={
            scannedData
              ? {
                  name: scannedData.name,
                  description: scannedData.description,
                  categoryId: '',
                  servings: scannedData.servings,
                  ovenSettings: [],
                }
              : undefined
          }
          onSubmit={handleSubmit}
          submitLabel={saving ? '저장 중...' : '레시피 생성'}
          hideSubmitButton
        />
      </div>

      {/* 재료 */}
      <div className="bg-white rounded-[28px] border-3 border-[var(--color-mint-light)] shadow-[var(--shadow-card)] p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <IngredientForm ingredients={ingredients} onChange={setIngredients} />
      </div>

      {/* 이미지 */}
      <div className="bg-white rounded-[28px] border-3 border-[var(--color-yellow-light)] shadow-[var(--shadow-card)] p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📸</span>
          <h3 className="text-lg font-['Jua'] text-[#D68910]">이미지</h3>
        </div>
        <ImageUploader currentImage={imageUrl} onImageChange={setImageUrl} />
      </div>

      {/* 저장 버튼 */}
      <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <Button
          onClick={() => {
            const form = document.querySelector('form');
            if (form) form.requestSubmit();
          }}
          icon="✨"
          className="w-full"
          disabled={saving}
        >
          {saving ? '저장 중...' : '레시피 생성'}
        </Button>
      </div>

      {/* 레시피 스캐너 모달 */}
      {showScanner && (
        <RecipeScanner
          onRecipeExtracted={handleRecipeExtracted}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
