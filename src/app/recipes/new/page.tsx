'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecipeStore } from '@/store/recipeStore';
import { RecipeBasicForm, IngredientForm, ImageUploader } from '@/components/recipe';
import { Button, AIGeneratingOverlay } from '@/components/ui';
import { OvenSetting, Ingredient } from '@/types';
import { generateRecipeImage } from '@/app/actions/generateRecipeImage';

export default function NewRecipePage() {
  const router = useRouter();
  const { addRecipe } = useRecipeStore();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);

  const handleSubmit = async (data: {
    name: string;
    description: string;
    categoryId: string;
    servings: number;
    ovenSettings: OvenSetting[];
  }) => {
    setSaving(true);
    setGeneratingImage(true);

    try {
      // Generate AI image if no manual image was uploaded
      let finalImageUrl = imageUrl;
      if (!imageUrl) {
        const result = await generateRecipeImage(data.name, data.description);
        finalImageUrl = result.imageUrl;
      }

      setGeneratingImage(false);

      const id = await addRecipe({
        ...data,
        imageUrl: finalImageUrl,
        ingredients,
      });
      router.push(`/recipes/${id}`);
    } catch (error) {
      console.error('Error saving recipe:', error);
      setGeneratingImage(false);
      setSaving(false);
    }
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

      {/* 기본 정보 */}
      <div className="bg-white rounded-[28px] border-3 border-[var(--color-peach-light)] shadow-[var(--shadow-card)] p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <RecipeBasicForm
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

      {/* AI Image Generation Overlay */}
      <AIGeneratingOverlay isVisible={generatingImage} />
    </div>
  );
}
