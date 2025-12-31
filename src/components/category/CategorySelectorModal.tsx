'use client';

import { useState, useEffect } from 'react';
import { useCategoryStore } from '@/store/categoryStore';

interface CategorySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategoryId: string;
  onSelect: (categoryId: string) => void;
}

export default function CategorySelectorModal({
  isOpen,
  onClose,
  selectedCategoryId,
  onSelect,
}: CategorySelectorModalProps) {
  const { categories, fetchCategories, addCategory, error: storeError } = useCategoryStore();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [tempSelectedId, setTempSelectedId] = useState(selectedCategoryId);
  const [isAdding, setIsAdding] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setTempSelectedId(selectedCategoryId);
      setLocalError(null);
    }
  }, [isOpen, fetchCategories, selectedCategoryId]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || isAdding) return;

    setIsAdding(true);
    setLocalError(null);

    try {
      await addCategory({ name: newCategoryName.trim() });
      setNewCategoryName('');
      await fetchCategories();
    } catch (error) {
      console.error('카테고리 추가 실패:', error);
      setLocalError(error instanceof Error ? error.message : '카테고리 추가에 실패했습니다.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleConfirm = () => {
    onSelect(tempSelectedId);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCategory();
    }
  };

  if (!isOpen) return null;

  const displayError = localError || storeError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl p-6 w-[90%] max-w-md shadow-xl animate-bounce-in">
        <h2 className="text-xl font-['Jua'] text-[#333333] text-center mb-6">
          카테고리를 선택하세요
        </h2>

        {/* Error Message */}
        {displayError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-['Gowun_Dodum']">
            {displayError}
          </div>
        )}

        {/* Add New Category */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="새 카테고리 입력"
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-['Gowun_Dodum'] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#27AE60]"
          />
          <button
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim() || isAdding}
            className="w-12 h-12 flex items-center justify-center bg-[#27AE60] text-white rounded-xl text-2xl font-bold hover:bg-[#219A52] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isAdding ? '...' : '+'}
          </button>
        </div>

        {/* Category List */}
        <div className="max-h-60 overflow-y-auto mb-6 space-y-2">
          {categories.length === 0 ? (
            <p className="text-center text-gray-400 font-['Gowun_Dodum'] py-4">
              카테고리가 없습니다. 새로 추가해주세요.
            </p>
          ) : (
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setTempSelectedId(category.id)}
                className={`w-full px-4 py-3 rounded-xl font-['Jua'] text-left transition-all duration-200 ${
                  tempSelectedId === category.id
                    ? 'bg-[#FFEEE8] text-[#E67E22] border-2 border-[#E67E22]'
                    : 'bg-[#F5F6FA] text-[#333333] border-2 border-transparent hover:bg-[#E8F5EE]'
                }`}
              >
                {category.name}
              </button>
            ))
          )}
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-[#E67E22] text-white rounded-2xl font-['Jua'] text-lg hover:bg-[#D35400] transition-all duration-200"
        >
          확인
        </button>
      </div>
    </div>
  );
}
