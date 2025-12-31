'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import { CategorySelectorModal } from '@/components/category';
import { useCategoryStore } from '@/store/categoryStore';
import { OvenSetting } from '@/types';
import OvenSettingForm from './OvenSettingForm';

const ovenSettingSchema = z.object({
  id: z.string(),
  type: z.enum(['preheat', 'heat']),
  temperature: z.number(),
  duration: z.number(),
});

const recipeBasicSchema = z.object({
  name: z.string().min(1, '레시피 이름을 입력하세요'),
  description: z.string(),
  categoryId: z.string(),
  servings: z.number().min(1, '제공량은 1 이상이어야 합니다'),
  ovenSettings: z.array(ovenSettingSchema),
});

type RecipeBasicFormData = z.infer<typeof recipeBasicSchema>;

interface RecipeBasicFormProps {
  initialData?: {
    name: string;
    description: string;
    categoryId: string;
    servings: number;
    ovenSettings: OvenSetting[];
  };
  onSubmit: (data: RecipeBasicFormData) => Promise<void>;
  submitLabel?: string;
  hideSubmitButton?: boolean;
}

export default function RecipeBasicForm({
  initialData,
  onSubmit,
  submitLabel = '저장',
  hideSubmitButton = false,
}: RecipeBasicFormProps) {
  const { categories, fetchCategories } = useCategoryStore();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RecipeBasicFormData>({
    resolver: zodResolver(recipeBasicSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      categoryId: initialData?.categoryId || '',
      servings: initialData?.servings || 1,
      ovenSettings: initialData?.ovenSettings || [],
    },
  });

  const ovenSettings = watch('ovenSettings');
  const selectedCategoryId = watch('categoryId');

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          {...register('name')}
          label="레시피 이름"
          placeholder="예: 바게트"
          error={errors.name?.message}
        />

        <div>
          <label className="flex items-center gap-2 text-sm font-['Jua'] text-[#333333] mb-2">
            설명
          </label>
          <textarea
            {...register('description')}
            className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-2xl font-['Gowun_Dodum'] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-orange-300 focus:ring-3 focus:ring-orange-100 resize-none"
            rows={3}
            placeholder="레시피에 대한 설명을 입력하세요"
          />
        </div>

        {/* Category Selector Button */}
        <div>
          <label className="flex items-center gap-2 text-sm font-['Jua'] text-[#333333] mb-2">
            카테고리
          </label>
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-2xl font-['Gowun_Dodum'] text-left bg-white hover:border-orange-300 transition-all duration-200 flex items-center justify-between"
          >
            <span className={selectedCategory ? 'text-gray-800' : 'text-gray-400'}>
              {selectedCategory?.name || '카테고리 선택'}
            </span>
            <span className="text-[#E67E22]">
              {selectedCategory?.name || 'Category'}
            </span>
          </button>
        </div>

        <Input
          type="number"
          {...register('servings', { valueAsNumber: true })}
          label="제공량 (인분)"
          min={1}
          error={errors.servings?.message}
        />

        <OvenSettingForm
          settings={ovenSettings}
          onChange={(settings) => setValue('ovenSettings', settings)}
        />

        {!hideSubmitButton && (
          <div className="pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? '저장 중...' : submitLabel}
            </Button>
          </div>
        )}
      </form>

      {/* Category Selector Modal */}
      <CategorySelectorModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        selectedCategoryId={selectedCategoryId}
        onSelect={(categoryId) => setValue('categoryId', categoryId)}
      />
    </>
  );
}
