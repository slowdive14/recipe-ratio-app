'use client';

import { useState } from 'react';
import { FractionValue, IngredientUnit } from '@/types';

interface UnitSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredientName: string;
  currentAmount: number;
  currentFraction: FractionValue;
  currentUnit: IngredientUnit;
  onConfirm: (amount: number, fraction: FractionValue, unit: IngredientUnit) => void;
}

const FRACTIONS: { value: FractionValue; label: string }[] = [
  { value: '1/4', label: '¼' },
  { value: '1/3', label: '⅓' },
  { value: '1/2', label: '½' },
  { value: '2/3', label: '⅔' },
  { value: '3/4', label: '¾' },
  { value: '1/8', label: '⅛' },
];

const UNITS: { value: IngredientUnit; label: string; color: string }[] = [
  { value: '그램', label: 'g', color: 'bg-[#E8F5EE] text-[#27AE60]' },
  { value: '개', label: '개', color: 'bg-[#FFF8E7] text-[#D68910]' },
  { value: '밀리리터', label: 'ml', color: 'bg-[#E8F5EE] text-[#27AE60]' },
  { value: '꼬집', label: '꼬집', color: 'bg-[#FFEEE8] text-[#E67E22]' },
  { value: '리터', label: 'L', color: 'bg-[#E8F5EE] text-[#27AE60]' },
  { value: '티스푼', label: 'tsp', color: 'bg-[#EDE8F5] text-[#8E44AD]' },
  { value: '테이블스푼', label: 'Tbsp', color: 'bg-[#EDE8F5] text-[#8E44AD]' },
  { value: '컵', label: '컵', color: 'bg-[#FFF8E7] text-[#D68910]' },
];

export default function UnitSelectorModal({
  isOpen,
  onClose,
  ingredientName,
  currentAmount,
  currentFraction,
  currentUnit,
  onConfirm,
}: UnitSelectorModalProps) {
  const [amount, setAmount] = useState(currentAmount);
  const [fraction, setFraction] = useState<FractionValue>(currentFraction);
  const [unit, setUnit] = useState<IngredientUnit>(currentUnit);

  const handleConfirm = () => {
    onConfirm(amount, fraction, unit);
    onClose();
  };

  const incrementAmount = () => setAmount((prev) => prev + 1);
  const decrementAmount = () => setAmount((prev) => Math.max(0, prev - 1));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#F5F6FA] rounded-t-3xl p-6 w-full max-w-md shadow-xl animate-slide-up">
        {/* Done Button */}
        <button
          onClick={handleConfirm}
          className="absolute top-4 right-4 px-4 py-2 bg-[#27AE60] text-white rounded-lg font-['Jua'] text-sm hover:bg-[#219A52] transition-all"
        >
          Done
        </button>

        {/* Ingredient Name */}
        <h2 className="text-xl font-['Jua'] text-[#333333] text-center mb-6 mt-2">
          {ingredientName || '재료'}
        </h2>

        {/* Amount Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={decrementAmount}
            className="w-10 h-10 flex items-center justify-center bg-[#E8F5EE] text-[#27AE60] rounded-full text-2xl font-bold hover:bg-[#C5E8D4] transition-all"
          >
            -
          </button>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-20 text-center text-2xl font-['Jua'] text-[#333333] bg-white rounded-xl py-2 border-2 border-gray-200 focus:outline-none focus:border-[#27AE60]"
          />
          <button
            onClick={incrementAmount}
            className="w-10 h-10 flex items-center justify-center bg-[#FFF8E7] text-[#D68910] rounded-full text-2xl font-bold hover:bg-[#FFE9B8] transition-all"
          >
            +
          </button>
        </div>

        {/* Fraction Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <button
            onClick={() => setFraction('')}
            className={`px-4 py-2 rounded-lg font-['Jua'] text-sm transition-all ${
              fraction === ''
                ? 'bg-[#E67E22] text-white'
                : 'bg-white text-[#666666] hover:bg-[#FFEEE8]'
            }`}
          >
            없음
          </button>
          {FRACTIONS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFraction(f.value)}
              className={`w-12 h-10 rounded-lg font-['Jua'] text-lg transition-all ${
                fraction === f.value
                  ? 'bg-[#FFF8E7] text-[#D68910] border-2 border-[#D68910]'
                  : 'bg-white text-[#666666] hover:bg-[#FFF8E7]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Unit Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
          {UNITS.map((u) => (
            <button
              key={u.value}
              onClick={() => setUnit(u.value)}
              className={`px-4 py-2 rounded-lg font-['Jua'] text-sm transition-all ${
                unit === u.value
                  ? `${u.color} border-2 border-current`
                  : 'bg-white text-[#666666] hover:bg-[#F5F6FA]'
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
