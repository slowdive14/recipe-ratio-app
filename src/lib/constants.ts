import { IngredientUnit, FractionValue } from '@/types';

export const INGREDIENT_UNITS: IngredientUnit[] = [
  '그램',
  '개',
  '밀리리터',
  '꼬집',
  '리터',
  '티스푼',
  '테이블스푼',
  '컵',
  '파운드',
  '온스',
  '파인트',
  '쿼트',
  '액량 온스',
  '갤런',
];

export const FRACTION_VALUES: { value: FractionValue; label: string; decimal: number }[] = [
  { value: '', label: '-', decimal: 0 },
  { value: '1/8', label: '1/8', decimal: 0.125 },
  { value: '1/4', label: '1/4', decimal: 0.25 },
  { value: '1/3', label: '1/3', decimal: 0.333333 },
  { value: '1/2', label: '1/2', decimal: 0.5 },
  { value: '2/3', label: '2/3', decimal: 0.666667 },
  { value: '3/4', label: '3/4', decimal: 0.75 },
];

export const OVEN_SETTING_TYPES = [
  { value: 'preheat', label: '예열' },
  { value: 'heat', label: '가열' },
] as const;

export const RATIO_PRESETS = [
  { value: 0.5, label: '0.5배' },
  { value: 1, label: '1배' },
  { value: 1.5, label: '1.5배' },
  { value: 2, label: '2배' },
  { value: 3, label: '3배' },
];

export const FIREBASE_COLLECTIONS = {
  CATEGORIES: 'categories',
  RECIPES: 'recipes',
} as const;
