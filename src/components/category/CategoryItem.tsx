'use client';

import { useState } from 'react';
import { Category } from '@/types';
import { Button } from '@/components/ui';
import CategoryForm from './CategoryForm';

interface CategoryItemProps {
  category: Category;
  onEdit: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const categoryIcons = ['🍰', '🍪', '🧁', '🍩', '🥐', '🍞', '🥧', '🎂'];

export default function CategoryItem({ category, onEdit, onDelete }: CategoryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = async (name: string) => {
    await onEdit(category.id, name);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm(`"${category.name}" 카테고리를 삭제하시겠습니까?`)) return;

    setIsDeleting(true);
    try {
      await onDelete(category.id);
    } finally {
      setIsDeleting(false);
    }
  };

  // Get a consistent icon based on the category name
  const iconIndex = category.name.charCodeAt(0) % categoryIcons.length;

  if (isEditing) {
    return (
      <div className="p-5 bg-gradient-to-br from-white to-[var(--color-lavender-light)] rounded-2xl border-3 border-[var(--color-lavender)]">
        <CategoryForm
          onSubmit={handleEdit}
          initialValue={category.name}
          submitLabel="저장"
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="group flex items-center justify-between p-5 bg-white border-3 border-[var(--color-peach-light)] rounded-2xl hover:border-[var(--color-peach)] hover:shadow-[var(--shadow-cute)] transition-all duration-300">
      <div className="flex items-center gap-3">
        <span className="text-2xl group-hover:animate-wiggle">
          {categoryIcons[iconIndex]}
        </span>
        <span className="font-['Jua'] text-[var(--color-text)] text-lg">{category.name}</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-1 px-4 py-2 bg-white border-3 border-[var(--color-mint-light)] text-[var(--color-text)] rounded-full font-['Jua'] text-sm hover:bg-[var(--color-mint-light)] hover:border-[var(--color-mint)] hover:scale-105 transition-all duration-300"
        >
          <span>✏️</span>
          편집
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-1 px-4 py-2 bg-white border-3 border-[var(--color-pink-light)] text-[var(--color-text)] rounded-full font-['Jua'] text-sm hover:bg-[var(--color-pink-light)] hover:border-[var(--color-pink)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>🗑️</span>
          {isDeleting ? '삭제중...' : '삭제'}
        </button>
      </div>
    </div>
  );
}
