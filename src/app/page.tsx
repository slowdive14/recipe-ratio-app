'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRecipeStore } from '@/store/recipeStore';
import { RecipeCard } from '@/components/recipe';

export default function Home() {
  const { recipes, fetchRecipes, removeRecipe } = useRecipeStore();

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const recentRecipes = recipes.slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 animate-slide-up">
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 bg-[#FFEEE8]">
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 text-5xl opacity-60">🧁</div>
          <div className="absolute bottom-4 left-4 text-4xl opacity-40">🍪</div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-['Jua'] text-[#E67E22] mb-3">
              레시피 비율 계산기
            </h1>
            <p className="text-[#666666] text-base md:text-lg mb-6 font-['Gowun_Dodum'] max-w-md">
              나만의 레시피를 저장하고, 원하는 비율로 재료 양을 자동 계산해요!
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/recipes/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#E67E22] rounded-xl font-['Jua'] shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all duration-200"
              >
                <span className="text-xl">✨</span>
                새 레시피 만들기
              </Link>
              <Link
                href="/recipes"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFD4C4] text-[#E67E22] rounded-xl font-['Jua'] hover:bg-[#FFCAB8] transition-all duration-200"
              >
                <span className="text-xl">📖</span>
                레시피 목록 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Recipes Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h2 className="text-xl font-['Jua'] text-[#E67E22]">최근 레시피</h2>
          </div>
          <Link
            href="/recipes"
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#E8F5EE] text-[#27AE60] font-['Jua'] text-sm hover:bg-[#C5E8D4] transition-all duration-200"
          >
            전체 보기
            <span>→</span>
          </Link>
        </div>

        {recentRecipes.length === 0 ? (
          <div className="empty-state-cute animate-bounce-in">
            <span className="text-5xl block mb-3">🍳</span>
            <p className="text-[#666666] mb-4 font-['Gowun_Dodum']">
              아직 등록된 레시피가 없어요
            </p>
            <Link
              href="/recipes/new"
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#FFEEE8] text-[#E67E22] rounded-xl font-['Jua'] hover:bg-[#FFD4C4] transition-all duration-200"
            >
              <span>✨</span>
              첫 레시피 추가하기
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recentRecipes.map((recipe, index) => (
              <div
                key={recipe.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <RecipeCard
                  recipe={recipe}
                  onDelete={removeRecipe}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer Decoration */}
      <div className="mt-12 text-center opacity-40">
        <div className="flex justify-center gap-3 text-2xl">
          <span className="animate-float" style={{ animationDelay: '0s' }}>🧁</span>
          <span className="animate-float" style={{ animationDelay: '0.2s' }}>🍰</span>
          <span className="animate-float" style={{ animationDelay: '0.4s' }}>🍪</span>
          <span className="animate-float" style={{ animationDelay: '0.6s' }}>🥐</span>
          <span className="animate-float" style={{ animationDelay: '0.8s' }}>🎂</span>
        </div>
      </div>
    </div>
  );
}
