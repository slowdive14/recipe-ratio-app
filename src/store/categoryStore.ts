import { create } from 'zustand';
import { Category, CategoryInput } from '@/types';
import {
  createCategory as createCategoryApi,
  getCategories as getCategoriesApi,
  deleteCategory as deleteCategoryApi,
  updateCategory as updateCategoryApi,
} from '@/lib/category';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (input: CategoryInput) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  editCategory: (id: string, input: CategoryInput) => Promise<void>;
  reset: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await getCategoriesApi();
      set({ categories, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addCategory: async (input: CategoryInput) => {
    set({ loading: true, error: null });
    try {
      await createCategoryApi(input);
      await get().fetchCategories();
    } catch (error) {
      const errorMessage = (error as Error).message;
      set({ error: errorMessage, loading: false });
      throw error; // 에러를 다시 throw해서 호출자가 처리할 수 있게 함
    }
  },

  removeCategory: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteCategoryApi(id);
      await get().fetchCategories();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  editCategory: async (id: string, input: CategoryInput) => {
    set({ loading: true, error: null });
    try {
      await updateCategoryApi(id, input);
      await get().fetchCategories();
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  reset: () => set({ categories: [], loading: false, error: null }),
}));
