import { FractionValue } from '@/types';
import { FRACTION_VALUES } from './constants';

export function fractionToDecimal(fraction: FractionValue): number {
  const found = FRACTION_VALUES.find((f) => f.value === fraction);
  return found?.decimal || 0;
}

export function decimalToFraction(decimal: number): FractionValue {
  if (decimal === 0) return '';

  const tolerance = 0.01;
  for (const f of FRACTION_VALUES) {
    if (f.decimal > 0 && Math.abs(f.decimal - decimal) < tolerance) {
      return f.value;
    }
  }
  return '';
}

export function getTotalAmount(amount: number, fraction: FractionValue): number {
  return amount + fractionToDecimal(fraction);
}

export function formatAmount(totalAmount: number): { amount: number; fraction: FractionValue } {
  const wholeNumber = Math.floor(totalAmount);
  const decimalPart = totalAmount - wholeNumber;
  const fraction = decimalToFraction(decimalPart);

  return {
    amount: wholeNumber,
    fraction,
  };
}

export function formatIngredientAmount(amount: number, fraction: FractionValue): string {
  const parts: string[] = [];

  if (amount > 0) {
    parts.push(amount.toString());
  }

  if (fraction) {
    parts.push(fraction);
  }

  return parts.join(' ') || '0';
}
