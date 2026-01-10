'use client';

import { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import {
  getGeminiApiKey,
  setGeminiApiKey,
  GOOGLE_AI_STUDIO_URL,
} from '@/lib/gemini-api-key';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeySaved: () => void;
}

export default function ApiKeyModal({
  isOpen,
  onClose,
  onApiKeySaved,
}: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const savedKey = getGeminiApiKey();
      if (savedKey) {
        setApiKey(savedKey);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmedKey = apiKey.trim();

    if (!trimmedKey) {
      setError('API 키를 입력해주세요.');
      return;
    }

    if (!trimmedKey.startsWith('AIza')) {
      setError('올바른 Gemini API 키 형식이 아닙니다.');
      return;
    }

    setGeminiApiKey(trimmedKey);
    setError(null);
    onApiKeySaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-xl">
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔑</span>
              <h2 className="text-xl font-['Jua'] text-[#333333]">
                Gemini API 키 설정
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800 font-['Gowun_Dodum']">
              레시피 사진 스캔 기능을 사용하려면 Gemini API 키가 필요합니다.
              <br />
              무료로 발급받을 수 있으며, 키는 기기에만 저장됩니다.
            </p>
          </div>

          <a
            href={GOOGLE_AI_STUDIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-['Jua'] hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            <span>🌐</span>
            Google AI Studio에서 API 키 받기
            <span className="text-xs">↗</span>
          </a>

          <div className="space-y-2">
            <label className="block text-sm font-['Jua'] text-[#333333]">
              API 키 입력
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError(null);
              }}
              placeholder="AIza..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
            />
            {error && (
              <p className="text-sm text-red-600 font-['Gowun_Dodum']">
                {error}
              </p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <p className="text-xs text-yellow-800 font-['Gowun_Dodum']">
              💡 API 키는 이 기기의 브라우저에만 저장되며, 서버로 전송되지
              않습니다.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              취소
            </Button>
            <Button type="button" onClick={handleSave} className="flex-1">
              저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
