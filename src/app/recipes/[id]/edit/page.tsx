'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecipeStore } from '@/store/recipeStore';
import { RecipeBasicForm, IngredientForm, ImageUploader } from '@/components/recipe';
import { Button } from '@/components/ui';
import { OvenSetting, Ingredient } from '@/types';

interface RecipeEditPageProps {
  params: Promise<{ id: string }>;
}

export default function RecipeEditPage({ params }: RecipeEditPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { currentRecipe, loading, fetchRecipeById, editRecipe, clearCurrentRecipe } =
    useRecipeStore();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRecipeById(id);
    return () => clearCurrentRecipe();
  }, [id, fetchRecipeById, clearCurrentRecipe]);

  useEffect(() => {
    if (currentRecipe) {
      setIngredients(currentRecipe.ingredients || []);
      setImageUrl(currentRecipe.imageUrl || '');
    }
  }, [currentRecipe]);

  const handleSubmit = async (data: {
    name: string;
    description: string;
    categoryId: string;
    servings: number;
    ovenSettings: OvenSetting[];
  }) => {
    setSaving(true);
    try {
      await editRecipe(id, { ...data, ingredients, imageUrl });
      router.push(`/recipes/${id}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !currentRecipe) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="loading-cute mb-4">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className="text-[var(--color-text-light)] font-['Gowun_Dodum']">
            레시피를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div className="flex items-center gap-4">
          <span className="text-4xl animate-float">✏️</span>
          <h1 className="text-3xl font-['Jua'] text-[var(--color-text)]">레시피 편집</h1>
        </div>
        <Link
          href={`/recipes/${id}`}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-white border-3 border-[var(--color-peach-light)] text-[var(--color-text)] font-['Jua'] text-sm hover:bg-[var(--color-peach-light)] hover:border-[var(--color-peach)] hover:scale-105 transition-all duration-300"
        >
          취소
        </Link>
      </div>

      {/* 기본 정보 */}
      <div className="bg-white rounded-[28px] border-3 border-[var(--color-peach-light)] shadow-[var(--shadow-card)] p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <RecipeBasicForm
          initialData={{
            name: currentRecipe.name,
            description: currentRecipe.description,
            categoryId: currentRecipe.categoryId,
            servings: currentRecipe.servings,
            ovenSettings: currentRecipe.ovenSettings,
          }}
          onSubmit={handleSubmit}
          submitLabel={saving ? '저장 중...' : '저장'}
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
          icon="💾"
          className="w-full"
          disabled={saving}
        >
          {saving ? '저장 중...' : '레시피 저장'}
        </Button>
      </div>
    </div>
  );
}
