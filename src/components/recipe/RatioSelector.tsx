'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { RATIO_PRESETS } from '@/lib/constants';

interface RatioSelectorProps {
  ratio: number;
  onChange: (ratio: number) => void;
  originalServings: number;
}

export default function RatioSelector({
  ratio,
  onChange,
  originalServings,
}: RatioSelectorProps) {
  const [customRatio, setCustomRatio] = useState('');

  const handlePresetClick = (presetRatio: number) => {
    onChange(presetRatio);
    setCustomRatio('');
  };

  const handleCustomChange = (value: string) => {
    setCustomRatio(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      onChange(numValue);
    }
  };

  const newServings = Math.round(originalServings * ratio);

  return (
    <div className="bg-white rounded-[28px] border-3 border-[var(--color-peach-light)] shadow-[var(--shadow-card)] p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">⚖️</span>
        <h2 className="text-xl font-['Jua'] text-[var(--color-text)]">비율 조절</h2>
      </div>

      <div className="space-y-6">
        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-3">
          {RATIO_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePresetClick(preset.value)}
              className={`px-5 py-3 rounded-full font-['Jua'] text-sm transition-all duration-300 border-3 ${
                ratio === preset.value
                  ? 'bg-gradient-to-r from-[var(--color-peach)] to-[#FF9B7A] text-white border-white/30 shadow-[var(--shadow-cute)] scale-105'
                  : 'bg-white text-[var(--color-text)] border-[var(--color-peach-light)] hover:border-[var(--color-peach)] hover:scale-105'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="flex items-end gap-3">
          <div className="w-40">
            <Input
              type="number"
              label="직접 입력"
              icon="✏️"
              value={customRatio}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="예: 1.5"
              step="0.1"
              min="0.1"
            />
          </div>
          <span className="pb-4 text-lg font-['Jua'] text-[var(--color-text)]">배</span>
        </div>

        {/* Current Ratio Display */}
        <div className="p-5 bg-gradient-to-br from-[var(--color-mint-light)] to-[var(--color-lavender-light)] rounded-2xl border-2 border-[var(--color-mint)]">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">📊</span>
            <span className="font-['Jua'] text-[var(--color-text)]">
              현재 비율: <span className="text-[#5A9A7F]">{ratio}배</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">👥</span>
            <span className="font-['Gowun_Dodum'] text-[var(--color-text)]">
              제공량: {originalServings}인분
              <span className="mx-2 text-[var(--color-peach)]">→</span>
              <span className="font-['Jua'] text-[#5A9A7F]">{newServings}인분</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
