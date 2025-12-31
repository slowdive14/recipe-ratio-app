'use client';

import { CategoryList } from '@/components/category';

export default function CategoriesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8 animate-slide-up">
        <span className="text-4xl animate-float">🏷️</span>
        <h1 className="text-3xl font-['Jua'] text-[var(--color-text)]">카테고리 관리</h1>
      </div>
      <CategoryList />
    </div>
  );
}
