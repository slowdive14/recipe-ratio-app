'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRecipeStore } from '@/store/recipeStore';
import { useCategoryStore } from '@/store/categoryStore';
import { RatioSelector, ScaledIngredientList } from '@/components/recipe';
import { Button } from '@/components/ui';
import { calculateScaledIngredients } from '@/lib/ratioCalculator';

interface RecipeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { currentRecipe, loading, fetchRecipeById, clearCurrentRecipe, addRecipe } =
    useRecipeStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [ratio, setRatio] = useState(1);

  useEffect(() => {
    fetchRecipeById(id);
    fetchCategories();
    return () => clearCurrentRecipe();
  }, [id, fetchRecipeById, fetchCategories, clearCurrentRecipe]);

  const category = categories.find((c) => c.id === currentRecipe?.categoryId);

  const scaledIngredients = currentRecipe
    ? calculateScaledIngredients(currentRecipe.ingredients, ratio)
    : [];

  const handleSaveAsNew = async () => {
    if (!currentRecipe) return;

    const newServings = Math.round(currentRecipe.servings * ratio);
    const newId = await addRecipe({
      name: `${currentRecipe.name} (${ratio}배)`,
      description: currentRecipe.description,
      categoryId: currentRecipe.categoryId,
      imageUrl: currentRecipe.imageUrl,
      servings: newServings,
      ovenSettings: currentRecipe.ovenSettings,
      ingredients: scaledIngredients,
    });

    router.push(`/recipes/${newId}`);
  };

  if (loading || !currentRecipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-slide-up">
        <div className="flex items-center gap-4">
          <span className="text-4xl animate-float">🧁</span>
          <h1 className="text-3xl font-['Jua'] text-[var(--color-text)]">
            {currentRecipe.name}
          </h1>
        </div>
        <Link
          href={`/recipes/${id}/edit`}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-mint)] to-[#7DD3B8] text-[var(--color-text)] rounded-full font-['Jua'] shadow-[var(--shadow-cute)] hover:shadow-[var(--shadow-float)] hover:scale-105 transition-all duration-300 border-3 border-white/50"
        >
          <span>✏️</span>
          편집
        </Link>
      </div>

      {/* Image */}
      {(() => {
        const hasValidImage = currentRecipe.imageUrl &&
          !currentRecipe.imageUrl.includes('placeholder-food') &&
          currentRecipe.imageUrl.trim() !== '';

        if (hasValidImage) {
          return (
            <div className="rounded-[32px] overflow-hidden shadow-[var(--shadow-float)] border-3 border-[var(--color-peach-light)] animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <img
                src={currentRecipe.imageUrl}
                alt={currentRecipe.name}
                className="w-full h-72 object-cover"
              />
            </div>
          );
        }

        return (
          <div className="rounded-[32px] overflow-hidden shadow-[var(--shadow-float)] border-3 border-[var(--color-peach-light)] animate-slide-up h-48 bg-gradient-to-br from-[#FFF8E7] via-[#FFEEE8] to-[#EDE8F5] flex items-center justify-center relative" style={{ animationDelay: '0.1s' }}>
            <div className="absolute top-4 left-6 w-12 h-12 bg-white/40 rounded-full" />
            <div className="absolute bottom-6 right-8 w-16 h-16 bg-white/30 rounded-full" />
            <div className="absolute top-10 right-16 w-8 h-8 bg-white/50 rounded-full" />
            <div className="absolute bottom-8 left-16 w-10 h-10 bg-white/35 rounded-full" />
            <div className="text-center">
              <span className="text-6xl animate-bounce block mb-2">🍽️</span>
              <p className="font-['Jua'] text-[#999] text-sm">맛있는 요리가 될 거예요!</p>
            </div>
          </div>
        );
      })()}

      {/* Info Card */}
      <div className="bg-white rounded-[28px] border-3 border-[var(--color-peach-light)] shadow-[var(--shadow-card)] p-8 space-y-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex flex-wrap items-center gap-3">
          {category && (
            <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-['Jua'] bg-[var(--color-lavender-light)] text-[#7A6AAA] border-2 border-[var(--color-lavender)]">
              <span>🏷️</span>
              {category.name}
            </span>
          )}
          <span className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-['Jua'] bg-[var(--color-mint-light)] text-[#5A9A7F] border-2 border-[var(--color-mint)]">
            <span>👥</span>
            {currentRecipe.servings}인분
          </span>
        </div>

        {currentRecipe.description && (
          <p className="text-[var(--color-text)] font-['Gowun_Dodum'] text-lg leading-relaxed">
            {currentRecipe.description}
          </p>
        )}
      </div>

      {/* Oven Settings */}
      {currentRecipe.ovenSettings.length > 0 && (
        <div className="bg-white rounded-[28px] border-3 border-[var(--color-peach-light)] shadow-[var(--shadow-card)] p-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🔥</span>
            <h2 className="text-xl font-['Jua'] text-[var(--color-text)]">오븐 설정</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {currentRecipe.ovenSettings.map((setting, index) => (
              <div
                key={setting.id}
                className="flex items-center gap-4 p-4 bg-gradient-to-br from-[var(--color-yellow-light)] to-[var(--color-peach-light)] rounded-2xl border-2 border-[var(--color-yellow)]"
              >
                <span className="flex items-center justify-center w-10 h-10 bg-white rounded-full text-lg font-['Jua'] text-[var(--color-text)]">
                  {index + 1}
                </span>
                <div className="font-['Gowun_Dodum']">
                  <p className="font-['Jua'] text-[var(--color-text)]">
                    {setting.type === 'preheat' ? '예열' : '가열'}
                  </p>
                  <p className="text-sm text-[var(--color-text-light)]">
                    {setting.temperature}°C · {setting.duration}분
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ratio Selector */}
      <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <RatioSelector
          ratio={ratio}
          onChange={setRatio}
          originalServings={currentRecipe.servings}
        />
      </div>

      {/* Ingredients */}
      <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <ScaledIngredientList ingredients={scaledIngredients} ratio={ratio} />
      </div>

      {/* Save as New Button */}
      {ratio !== 1 && (
        <div className="flex justify-end animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <Button onClick={handleSaveAsNew} icon="💾" size="lg">
            이 비율로 새 레시피 저장
          </Button>
        </div>
      )}

      {/* Empty Ingredients State */}
      {currentRecipe.ingredients.length === 0 && (
        <div className="empty-state-cute animate-bounce-in">
          <span className="text-6xl block mb-4">🥄</span>
          <p className="text-[var(--color-text-light)] text-lg mb-4 font-['Gowun_Dodum']">
            아직 등록된 재료가 없어요
          </p>
          <Link
            href={`/recipes/${id}/edit`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-peach)] to-[#FF9B7A] text-white rounded-full font-['Jua'] hover:scale-105 transition-all duration-300 shadow-[var(--shadow-cute)]"
          >
            <span>✨</span>
            재료 추가하기
          </Link>
        </div>
      )}

      {/* Footer Decoration */}
      <div className="text-center pt-8 opacity-50">
        <div className="flex justify-center gap-3 text-2xl">
          <span className="animate-float" style={{ animationDelay: '0s' }}>🥄</span>
          <span className="animate-float" style={{ animationDelay: '0.2s' }}>🍴</span>
          <span className="animate-float" style={{ animationDelay: '0.4s' }}>🥣</span>
        </div>
      </div>
    </div>
  );
}
