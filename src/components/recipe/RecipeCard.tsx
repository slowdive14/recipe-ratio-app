'use client';

import Link from 'next/link';
import { Recipe } from '@/types';
import { useCategoryStore } from '@/store/categoryStore';

interface RecipeCardProps {
  recipe: Recipe;
  onDelete?: (id: string) => void;
}

const categoryIcons = ['🍰', '🍪', '🧁', '🍩', '🥐', '🍞', '🥧', '🎂'];
const foodEmojis = ['🍳', '🥘', '🍲', '🍜', '🍝', '🍛', '🥗', '🍱', '🥞', '🧇', '🥐', '🍕'];

export default function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  const { categories } = useCategoryStore();
  const category = categories.find((c) => c.id === recipe.categoryId);
  const categoryIndex = categories.findIndex((c) => c.id === recipe.categoryId);

  // Check if image is valid (not empty and not fallback)
  const hasValidImage = recipe.imageUrl &&
    !recipe.imageUrl.includes('placeholder-food') &&
    recipe.imageUrl.trim() !== '';

  // Random but consistent emoji based on recipe id
  const emojiIndex = recipe.id.charCodeAt(0) % foodEmojis.length;
  const randomEmoji = foodEmojis[emojiIndex];

  const handleDelete = () => {
    if (!confirm(`"${recipe.name}" 레시피를 삭제하시겠습니까?`)) return;
    onDelete?.(recipe.id);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-200 hover:translate-y-[-4px] hover:shadow-md">
      {/* Image Section - Clickable */}
      <Link href={`/recipes/${recipe.id}`} className="block">
        {hasValidImage ? (
          <div className="relative h-40 overflow-hidden cursor-pointer">
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="h-40 bg-gradient-to-br from-[#FFF8E7] via-[#FFEEE8] to-[#EDE8F5] flex items-center justify-center relative overflow-hidden cursor-pointer">
            {/* Decorative circles */}
            <div className="absolute top-2 left-3 w-8 h-8 bg-white/40 rounded-full" />
            <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/30 rounded-full" />
            <div className="absolute top-8 right-8 w-6 h-6 bg-white/50 rounded-full" />
            {/* Main emoji */}
            <span className="text-5xl animate-bounce drop-shadow-sm">{randomEmoji}</span>
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div className="p-4">
        {/* Title & Category */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-['Jua'] text-[#333333] leading-tight">
            {recipe.name}
          </h3>
          {category && (
            <span className="flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-full text-xs font-['Jua'] bg-[#EDE8F5] text-[#8E44AD]">
              <span className="text-sm">{categoryIcons[categoryIndex % categoryIcons.length]}</span>
              {category.name}
            </span>
          )}
        </div>

        {/* Description */}
        {recipe.description && (
          <p className="text-[#666666] text-sm mb-3 line-clamp-2 font-['Gowun_Dodum']">
            {recipe.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-2 text-sm text-[#666666] mb-3 font-['Gowun_Dodum']">
          <span className="flex items-center gap-1 px-2.5 py-1 bg-[#E8F5EE] rounded-full text-[#27AE60]">
            <span>👥</span>
            {recipe.servings}인분
          </span>
          {recipe.ovenSettings.length > 0 && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-[#FFF8E7] rounded-full text-[#D68910]">
              <span>🔥</span>
              {recipe.ovenSettings[0].temperature}°C
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/recipes/${recipe.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#FFEEE8] text-[#E67E22] rounded-xl font-['Jua'] text-sm hover:bg-[#FFD4C4] transition-all duration-200"
          >
            <span>👀</span>
            상세보기
          </Link>
          <Link
            href={`/recipes/${recipe.id}/edit`}
            className="flex items-center justify-center gap-1 px-3 py-2.5 bg-white border-2 border-gray-200 text-[#666666] rounded-xl font-['Jua'] text-sm hover:bg-[#F5F6FA] hover:border-gray-300 transition-all duration-200"
          >
            <span>✏️</span>
            편집
          </Link>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="flex items-center justify-center px-3 py-2.5 bg-white border-2 border-gray-200 text-[#666666] rounded-xl font-['Jua'] text-sm hover:bg-[#FDEDEC] hover:border-[#E74C3C] hover:text-[#E74C3C] transition-all duration-200"
            >
              <span>🗑️</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
