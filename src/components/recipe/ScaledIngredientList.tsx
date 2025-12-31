'use client';

import { Ingredient } from '@/types';
import { formatIngredientAmount } from '@/lib/fraction';

interface ScaledIngredientListProps {
  ingredients: Ingredient[];
  ratio: number;
}

const ingredientIcons = ['🥚', '🧈', '🥛', '🍚', '🧂', '🍯', '🍋', '🫒'];

export default function ScaledIngredientList({
  ingredients,
  ratio,
}: ScaledIngredientListProps) {
  const isScaled = ratio !== 1;

  return (
    <div className="bg-white rounded-[28px] border-3 border-[var(--color-peach-light)] shadow-[var(--shadow-card)] p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🥣</span>
          <h2 className="text-xl font-['Jua'] text-[var(--color-text)]">
            재료
            {isScaled && (
              <span className="ml-2 px-3 py-1 bg-[var(--color-mint-light)] text-[#5A9A7F] rounded-full text-sm border-2 border-[var(--color-mint)]">
                {ratio}배 적용
              </span>
            )}
          </h2>
        </div>
      </div>

      {ingredients.length === 0 ? (
        <p className="text-[var(--color-text-light)] font-['Gowun_Dodum'] text-center py-4">
          등록된 재료가 없습니다.
        </p>
      ) : (
        <ul className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <li
              key={ingredient.id}
              className="group flex items-center justify-between p-4 bg-gradient-to-r from-[var(--color-cream)] to-white rounded-2xl border-2 border-[var(--color-peach-light)] hover:border-[var(--color-peach)] hover:shadow-[var(--shadow-cute)] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl group-hover:animate-wiggle">
                  {ingredientIcons[index % ingredientIcons.length]}
                </span>
                <span className="font-['Jua'] text-[var(--color-text)]">
                  {ingredient.name}
                </span>
              </div>
              <span className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border-2 border-[var(--color-lavender-light)] font-['Gowun_Dodum']">
                <span className="font-['Jua'] text-[var(--color-text)]">
                  {formatIngredientAmount(ingredient.amount, ingredient.fraction)}
                </span>
                <span className="text-[var(--color-text-light)]">{ingredient.unit}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
