'use client';

import { useState } from 'react';
import { Ingredient, FractionValue, IngredientUnit } from '@/types';
import { generateId } from '@/lib/utils';
import { formatIngredientAmount } from '@/lib/fraction';
import UnitSelectorModal from './UnitSelectorModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface IngredientFormProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
  readOnly?: boolean;
}

interface SortableIngredientItemProps {
  ingredient: Ingredient;
  removeIngredient: (id: string) => void;
  updateIngredientName: (id: string, name: string) => void;
  openUnitSelector: (ingredient: Ingredient) => void;
}

function SortableIngredientItem({
  ingredient,
  removeIngredient,
  updateIngredientName,
  openUnitSelector,
}: SortableIngredientItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ingredient.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 bg-white rounded-xl shadow-sm border border-transparent hover:border-[#FFEEE8] transition-all touch-none"
    >
      {/* Delete Button */}
      <button
        type="button"
        onClick={() => removeIngredient(ingredient.id)}
        className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[#FDEDEC] text-[#E74C3C] rounded-full text-lg font-bold hover:bg-[#FADBD8] transition-all active:scale-95"
        aria-label="재료 삭제"
      >
        -
      </button>

      {/* Ingredient Name */}
      <input
        type="text"
        value={ingredient.name}
        onChange={(e) => updateIngredientName(ingredient.id, e.target.value)}
        placeholder="재료명 (예: 밀가루)"
        className="flex-1 min-w-0 px-2 py-2 bg-transparent font-['Gowun_Dodum'] text-[#333333] placeholder:text-gray-400 focus:outline-none text-base"
      />

      {/* Amount & Unit Button */}
      <button
        type="button"
        onClick={() => openUnitSelector(ingredient)}
        className={`flex-shrink-0 flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-['Gowun_Dodum'] transition-all border ${ingredient.amount > 0 || ingredient.fraction
          ? 'bg-[#E8F5EE] text-[#27AE60] border-[#27AE60]/20'
          : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
          }`}
      >
        <span className="text-sm font-bold truncate max-w-[100px]">
          {ingredient.amount > 0 || ingredient.fraction
            ? `${formatIngredientAmount(ingredient.amount, ingredient.fraction)} ${ingredient.unit}`
            : '수량 입력'}
        </span>
        {(ingredient.amount === 0 && !ingredient.fraction) && (
          <span className="text-xs">✏️</span>
        )}
      </button>

      {/* Drag Handle */}
      <span
        {...attributes}
        {...listeners}
        className="text-gray-300 cursor-move flex-shrink-0 px-1 hover:text-gray-500 transition-colors"
      >
        ≡
      </span>
    </div>
  );
}

export default function IngredientForm({
  ingredients,
  onChange,
  readOnly = false,
}: IngredientFormProps) {
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: generateId(),
      name: '',
      amount: 0,
      fraction: '',
      unit: '그램',
    };
    onChange([...ingredients, newIngredient]);
  };

  const updateIngredientName = (id: string, name: string) => {
    onChange(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, name } : ing
      )
    );
  };

  const updateIngredientUnit = (
    id: string,
    amount: number,
    fraction: FractionValue,
    unit: IngredientUnit
  ) => {
    onChange(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, amount, fraction, unit } : ing
      )
    );
  };

  const removeIngredient = (id: string) => {
    onChange(ingredients.filter((ing) => ing.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = ingredients.findIndex((item) => item.id === active.id);
      const newIndex = ingredients.findIndex((item) => item.id === over.id);

      onChange(arrayMove(ingredients, oldIndex, newIndex));
    }
  };

  const openUnitSelector = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
  };

  if (readOnly) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🥣</span>
          <h3 className="text-lg font-['Jua'] text-[#E67E22]">재료</h3>
        </div>
        {ingredients.length === 0 ? (
          <p className="text-gray-400 text-sm font-['Gowun_Dodum']">등록된 재료가 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {ingredients.map((ingredient) => (
              <li
                key={ingredient.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl"
              >
                <span className="font-['Jua'] text-[#333333]">{ingredient.name}</span>
                <span className="text-[#666666] font-['Gowun_Dodum']">
                  {formatIngredientAmount(ingredient.amount, ingredient.fraction)}{' '}
                  {ingredient.unit}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🥣</span>
          <h3 className="text-lg font-['Jua'] text-[#E67E22]">재료</h3>
        </div>
      </div>

      {ingredients.length === 0 ? (
        <p className="text-gray-400 text-sm font-['Gowun_Dodum'] text-center py-4">
          재료를 추가하세요
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={ingredients}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {ingredients.map((ingredient) => (
                <SortableIngredientItem
                  key={ingredient.id}
                  ingredient={ingredient}
                  removeIngredient={removeIngredient}
                  updateIngredientName={updateIngredientName}
                  openUnitSelector={openUnitSelector}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add Ingredient Button */}
      <button
        type="button"
        onClick={addIngredient}
        className="flex items-center gap-2 text-[#27AE60] font-['Jua'] hover:text-[#219A52] transition-all"
      >
        <span className="w-6 h-6 flex items-center justify-center bg-[#27AE60] text-white rounded-full text-sm">
          +
        </span>
        재료 추가하기
      </button>

      {/* Unit Selector Modal */}
      {editingIngredient && (
        <UnitSelectorModal
          isOpen={!!editingIngredient}
          onClose={() => setEditingIngredient(null)}
          ingredientName={editingIngredient.name}
          currentAmount={editingIngredient.amount}
          currentFraction={editingIngredient.fraction}
          currentUnit={editingIngredient.unit}
          onConfirm={(amount, fraction, unit) => {
            updateIngredientUnit(editingIngredient.id, amount, fraction, unit);
            setEditingIngredient(null);
          }}
        />
      )}
    </div>
  );
}
