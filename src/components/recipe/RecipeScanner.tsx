'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Button, ApiKeyModal } from '@/components/ui';
import {
  extractRecipeFromImage,
  ExtractedRecipe,
} from '@/app/actions/extractRecipeFromImage';
import {
  getGeminiApiKey,
  hasGeminiApiKey,
  GOOGLE_AI_STUDIO_URL,
} from '@/lib/gemini-api-key';

interface RecipeScannerProps {
  onRecipeExtracted: (recipe: ExtractedRecipe) => void;
  onClose: () => void;
}

export default function RecipeScanner({
  onRecipeExtracted,
  onClose,
}: RecipeScannerProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setHasApiKey(hasGeminiApiKey());
  }, []);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('JPG, PNG, GIF, WEBP 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError('파일 크기는 4MB 이하여야 합니다. 다른 이미지를 선택해주세요.');
      return;
    }

    setSelectedFile(file);
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
  };

  const handleAnalyze = async () => {
    if (!preview) return;

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      if (!selectedFile) {
        setError('파일을 찾을 수 없습니다.');
        setAnalyzing(false);
        return;
      }

      const base64 = await fileToBase64(selectedFile);
      const result = await extractRecipeFromImage(base64, selectedFile.type, apiKey);

      if (result.success && result.recipe) {
        onRecipeExtracted(result.recipe);
      } else {
        setError(result.error || '레시피 추출에 실패했습니다.');
      }
    } catch (err) {
      console.error('handleAnalyze error:', err);
      
      let errorDetail = '';
      if (err instanceof Error) {
        errorDetail = `[${err.name}] ${err.message}`;
        if (err.stack) {
          console.error('Stack:', err.stack);
        }
      } else if (typeof err === 'string') {
        errorDetail = err;
      } else {
        errorDetail = JSON.stringify(err);
      }
      
      setError(`오류: ${errorDetail || '알 수 없는 오류'}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setError(null);
    setSelectedFile(null);
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  const openGallery = () => {
    galleryInputRef.current?.click();
  };

  const handleApiKeySaved = () => {
    setHasApiKey(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-auto shadow-xl">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📷</span>
                <h2 className="text-xl font-['Jua'] text-[#333333]">
                  레시피 사진 스캔
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-500 font-['Gowun_Dodum']">
              레시피 사진을 촬영하거나 선택하면 AI가 자동으로 재료와 정보를
              추출합니다.
            </p>

            {/* API 키 상태 표시 */}
            <div
              className={`flex items-center justify-between p-3 rounded-xl ${
                hasApiKey
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{hasApiKey ? '✅' : '⚠️'}</span>
                <span
                  className={`text-sm font-['Gowun_Dodum'] ${
                    hasApiKey ? 'text-green-700' : 'text-yellow-700'
                  }`}
                >
                  {hasApiKey ? 'API 키 설정됨' : 'API 키 필요'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowApiKeyModal(true)}
                className={`text-xs px-3 py-1 rounded-full font-['Jua'] ${
                  hasApiKey
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                } transition-colors`}
              >
                {hasApiKey ? '변경' : '설정'}
              </button>
            </div>

            {/* 카메라 입력 */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
            {/* 갤러리 입력 */}
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />

            {preview ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={preview}
                    alt="레시피 미리보기"
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                  {analyzing && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-2xl">
                      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-3" />
                      <span className="text-white font-['Jua']">
                        AI가 분석 중...
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleReset}
                    disabled={analyzing}
                    className="flex-1"
                  >
                    다시 선택
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    icon="✨"
                    className="flex-1"
                  >
                    {analyzing ? '분석 중...' : '레시피 추출'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={openCamera}
                    className="h-40 border-3 border-dashed border-[#E67E22]/30 rounded-2xl flex flex-col items-center justify-center text-[#E67E22] hover:border-[#E67E22] hover:bg-[#FFF5EE] transition-all"
                  >
                    <span className="text-4xl mb-2">📷</span>
                    <span className="font-['Jua'] text-base">카메라</span>
                    <span className="text-xs text-gray-400 font-['Gowun_Dodum'] mt-1">
                      사진 촬영
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={openGallery}
                    className="h-40 border-3 border-dashed border-[#27AE60]/30 rounded-2xl flex flex-col items-center justify-center text-[#27AE60] hover:border-[#27AE60] hover:bg-[#E8F5EE] transition-all"
                  >
                    <span className="text-4xl mb-2">🖼️</span>
                    <span className="font-['Jua'] text-base">갤러리</span>
                    <span className="text-xs text-gray-400 font-['Gowun_Dodum'] mt-1">
                      사진 선택
                    </span>
                  </button>
                </div>
                <p className="text-xs text-center text-gray-400 font-['Gowun_Dodum']">
                  JPG, PNG, WEBP (최대 4MB)
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 font-['Gowun_Dodum']">
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onApiKeySaved={handleApiKeySaved}
      />
    </>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
