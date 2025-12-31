'use client';

import { useEffect } from 'react';
import { useCategoryStore } from '@/store/categoryStore';
import CategoryItem from './CategoryItem';
import CategoryForm from './CategoryForm';

export default function CategoryList() {
  const { categories, loading, error, fetchCategories, addCategory, removeCategory, editCategory } =
    useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = async (name: string) => {
    await addCategory({ name });
  };

  const handleEdit = async (id: string, name: string) => {
    await editCategory(id, { name });
  };

  const handleDelete = async (id: string) => {
    await removeCategory(id);
  };

  return (
    <div className="space-y-8">
      {/* Add New Category */}
      <div className="bg-white rounded-[28px] border-3 border-[var(--color-peach-light)] shadow-[var(--shadow-card)] p-8 animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">✨</span>
          <h2 className="text-lg font-['Jua'] text-[var(--color-text)]">새 카테고리 추가</h2>
        </div>
        <CategoryForm onSubmit={handleAdd} />
      </div>

      {/* Error State */}
      {error && (
        <div className="p-5 bg-[var(--color-pink-light)] border-3 border-[var(--color-pink)] text-[#B87A8F] rounded-2xl flex items-center gap-3 font-['Gowun_Dodum'] animate-bounce-in">
          <span className="text-xl">⚠️</span>
          오류: {error}
        </div>
      )}

      {/* Category List */}
      <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <h2 className="text-lg font-['Jua'] text-[var(--color-text)]">카테고리 목록</h2>
        </div>

        {loading && categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="loading-cute mb-4">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="text-[var(--color-text-light)] font-['Gowun_Dodum']">로딩중...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="empty-state-cute">
            <span className="text-5xl block mb-4">📁</span>
            <p className="text-[var(--color-text-light)] font-['Gowun_Dodum']">
              등록된 카테고리가 없어요
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CategoryItem
                  category={category}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
