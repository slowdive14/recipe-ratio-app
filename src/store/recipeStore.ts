import { create } from 'zustand';
import { Recipe, RecipeInput } from '@/types';
import {
  createRecipe as createRecipeApi,
  getRecipes as getRecipesApi,
  getRecipeById as getRecipeByIdApi,
  updateRecipe as updateRecipeApi,
  deleteRecipe as deleteRecipeApi,
} from '@/lib/recipe';

interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
  selectedCategoryId: string | null;
  fetchRecipes: (categoryId?: string) => Promise<void>;
  fetchRecipeById: (id: string) => Promise<void>;
  addRecipe: (input: RecipeInput) => Promise<string>;
  editRecipe: (id: string, input: Partial<RecipeInput>) => Promise<void>;
  removeRecipe: (id: string) => Promise<void>;
  setSelectedCategoryId: (categoryId: string | null) => void;
  clearCurrentRecipe: () => void;
  reset: () => void;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: [],
  currentRecipe: null,
  loading: false,
  error: null,
  selectedCategoryId: null,

  fetchRecipes: async (categoryId?: string) => {
    set({ loading: true, error: null });
    try {
      const recipes = await getRecipesApi(categoryId);
      set({ recipes, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchRecipeById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const recipe = await getRecipeByIdApi(id);
      set({ currentRecipe: recipe, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addRecipe: async (input: RecipeInput) => {
    set({ loading: true, error: null });
    try {
      const id = await createRecipeApi(input);
      await get().fetchRecipes(get().selectedCategoryId || undefined);
      return id;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  editRecipe: async (id: string, input: Partial<RecipeInput>) => {
    set({ loading: true, error: null });
    try {
      await updateRecipeApi(id, input);
      await get().fetchRecipes(get().selectedCategoryId || undefined);
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  removeRecipe: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteRecipeApi(id);
      await get().fetchRecipes(get().selectedCategoryId || undefined);
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  setSelectedCategoryId: (categoryId: string | null) => {
    set({ selectedCategoryId: categoryId });
  },

  clearCurrentRecipe: () => {
    set({ currentRecipe: null });
  },

  reset: () => set({ recipes: [], currentRecipe: null, loading: false, error: null, selectedCategoryId: null }),
}));
