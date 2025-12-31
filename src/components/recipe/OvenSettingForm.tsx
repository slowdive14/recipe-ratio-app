'use client';

import { OvenSetting, OvenSettingType } from '@/types';
import { Button, Input, Select } from '@/components/ui';
import { OVEN_SETTING_TYPES } from '@/lib/constants';
import { generateId } from '@/lib/utils';

interface OvenSettingFormProps {
  settings: OvenSetting[];
  onChange: (settings: OvenSetting[]) => void;
}

export default function OvenSettingForm({ settings, onChange }: OvenSettingFormProps) {
  const addSetting = () => {
    const newSetting: OvenSetting = {
      id: generateId(),
      type: 'heat',
      temperature: 200,
      duration: 10,
    };
    onChange([...settings, newSetting]);
  };

  const updateSetting = (id: string, field: keyof OvenSetting, value: string | number) => {
    onChange(
      settings.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  const removeSetting = (id: string) => {
    onChange(settings.filter((s) => s.id !== id));
  };

  const hasPreheat = settings.some((s) => s.type === 'preheat');

  const addPreheat = () => {
    const newPreheat: OvenSetting = {
      id: generateId(),
      type: 'preheat',
      temperature: 200,
      duration: 10,
    };
    onChange([newPreheat, ...settings]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">오븐 설정</h3>
        <div className="flex gap-2">
          {!hasPreheat && (
            <Button type="button" variant="secondary" size="sm" onClick={addPreheat}>
              예열 추가
            </Button>
          )}
          <Button type="button" variant="secondary" size="sm" onClick={addSetting}>
            가열 추가
          </Button>
        </div>
      </div>

      {settings.length === 0 ? (
        <p className="text-gray-500 text-sm">오븐 설정이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {settings.map((setting, index) => (
            <div
              key={setting.id}
              className="flex flex-col gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700">
                    단계 {index + 1}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${setting.type === 'preheat'
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-green-100 text-green-600'
                    }`}>
                    {setting.type === 'preheat' ? '예열' : '가열'}
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => removeSetting(setting.id)}
                  className="!p-1.5 h-auto bg-transparent hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                >
                  <span className="text-sm">🗑️</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Temperature Control */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">온도 (°C)</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateSetting(setting.id, 'temperature', Math.max(0, setting.temperature - 5))}
                      className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 rounded-xl text-xl text-gray-400 hover:text-[#E67E22] hover:border-[#E67E22] active:bg-orange-50 transition-all font-bold"
                    >
                      -
                    </button>
                    <div className="flex-1 relative">
                      <Input
                        type="number"
                        value={setting.temperature || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateSetting(setting.id, 'temperature', val === '' ? 0 : parseInt(val) || 0);
                        }}
                        placeholder="0"
                        min={0}
                        max={300}
                        className="text-center text-lg font-bold !px-0"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSetting(setting.id, 'temperature', Math.min(300, setting.temperature + 5))}
                      className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 rounded-xl text-xl text-gray-400 hover:text-[#E67E22] hover:border-[#E67E22] active:bg-orange-50 transition-all font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Duration Control */}
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">시간 (분)</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateSetting(setting.id, 'duration', Math.max(0, setting.duration - 5))}
                      className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 rounded-xl text-xl text-gray-400 hover:text-[#E67E22] hover:border-[#E67E22] active:bg-orange-50 transition-all font-bold"
                    >
                      -
                    </button>
                    <div className="flex-1 relative">
                      <Input
                        type="number"
                        value={setting.duration || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateSetting(setting.id, 'duration', val === '' ? 0 : parseInt(val) || 0);
                        }}
                        placeholder="0"
                        min={0}
                        className="text-center text-lg font-bold !px-0"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSetting(setting.id, 'duration', setting.duration + 5)}
                      className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 rounded-xl text-xl text-gray-400 hover:text-[#E67E22] hover:border-[#E67E22] active:bg-orange-50 transition-all font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
