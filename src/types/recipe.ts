import { Timestamp } from 'firebase/firestore';

export type IngredientUnit =
  | '그램'
  | '개'
  | '밀리리터'
  | '꼬집'
  | '리터'
  | '티스푼'
  | '테이블스푼'
  | '컵'
  | '파운드'
  | '온스'
  | '파인트'
  | '쿼트'
  | '액량 온스'
  | '갤런';

export type FractionValue = '1/8' | '1/4' | '1/3' | '1/2' | '2/3' | '3/4' | '';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  fraction: FractionValue;
  unit: IngredientUnit;
}

export type OvenSettingType = 'preheat' | 'heat';

export interface OvenSetting {
  id: string;
  type: OvenSettingType;
  temperature: number;
  duration: number;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  imageUrl: string;
  servings: number;
  ovenSettings: OvenSetting[];
  ingredients: Ingredient[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface RecipeInput {
  name: string;
  description: string;
  categoryId: string;
  imageUrl?: string;
  servings: number;
  ovenSettings: OvenSetting[];
  ingredients: Ingredient[];
}
