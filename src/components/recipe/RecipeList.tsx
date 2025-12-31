'use client';

import { useEffect } from 'react';
import { useRecipeStore } from '@/store/recipeStore';
import { useCategoryStore } from '@/store/categoryStore';
import RecipeCard from './RecipeCard';
import { Button } from '@/components/ui';

export default function RecipeList() {
  const {
    recipes,
    loading,
    error,
    selectedCategoryId,
    fetchRecipes,
    removeRecipe,
    setSelectedCategoryId,
  } = useRecipeStore();

  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchRecipes(selectedCategoryId || undefined);
  }, [fetchRecipes, selectedCategoryId]);

  const handleDelete = async (id: string) => {
    await removeRecipe(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategoryId === null ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setSelectedCategoryId(null)}
        >
          전체
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategoryId === category.id ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategoryId(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          오류: {error}
        </div>
      )}

      {loading && recipes.length === 0 ? (
        <p className="text-gray-500">로딩중...</p>
      ) : recipes.length === 0 ? (
        <p className="text-gray-500">등록된 레시피가 없습니다.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
