import { Ingredient, FractionValue } from '@/types';
import { getTotalAmount, formatAmount } from './fraction';
import { generateId } from './utils';

export function calculateScaledIngredients(
  ingredients: Ingredient[],
  ratio: number
): Ingredient[] {
  return ingredients.map((ingredient) => {
    const totalAmount = getTotalAmount(ingredient.amount, ingredient.fraction);
    const scaledTotal = totalAmount * ratio;
    const { amount, fraction } = formatAmount(scaledTotal);

    return {
      ...ingredient,
      id: generateId(),
      amount,
      fraction,
    };
  });
}

export function calculateRatioFromServings(
  originalServings: number,
  newServings: number
): number {
  return newServings / originalServings;
}

export function getDisplayRatio(ratio: number): string {
  if (ratio === 1) return '1배';
  if (ratio === 0.5) return '0.5배';
  if (ratio === 2) return '2배';
  if (ratio === 3) return '3배';
  return `${ratio.toFixed(2)}배`;
}
