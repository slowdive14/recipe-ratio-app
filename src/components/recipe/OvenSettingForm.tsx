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
      duration: 30,
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
              className="flex items-end gap-3 p-4 bg-gray-50 rounded-lg"
            >
              <div className="w-20">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  단계 {index + 1}
                </label>
                <span className="inline-block px-2 py-1 text-sm rounded bg-white border">
                  {setting.type === 'preheat' ? '예열' : '가열'}
                </span>
              </div>

              <div className="flex-1">
                <Input
                  type="number"
                  label="온도 (°C)"
                  value={setting.temperature}
                  onChange={(e) =>
                    updateSetting(setting.id, 'temperature', parseInt(e.target.value) || 0)
                  }
                  min={0}
                  max={300}
                  step={5}
                />
              </div>

              <div className="flex-1">
                <Input
                  type="number"
                  label="시간 (분)"
                  value={setting.duration}
                  onChange={(e) =>
                    updateSetting(setting.id, 'duration', parseInt(e.target.value) || 0)
                  }
                  min={0}
                />
              </div>

              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => removeSetting(setting.id)}
              >
                삭제
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
