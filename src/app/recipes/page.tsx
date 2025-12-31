'use client';

import Link from 'next/link';
import { RecipeList } from '@/components/recipe';

export default function RecipesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 animate-slide-up">
        <div className="flex items-center gap-4">
          <span className="text-4xl animate-float">📖</span>
          <h1 className="text-3xl font-['Jua'] text-[var(--color-text)]">레시피 목록</h1>
        </div>
        <Link
          href="/recipes/new"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--color-mint)] to-[#7DD3B8] text-[var(--color-text)] rounded-full font-['Jua'] shadow-[var(--shadow-cute)] hover:shadow-[var(--shadow-float)] hover:scale-105 transition-all duration-300 border-3 border-white/50"
        >
          <span>✨</span>
          새 레시피
        </Link>
      </div>
      <RecipeList />
    </div>
  );
}
