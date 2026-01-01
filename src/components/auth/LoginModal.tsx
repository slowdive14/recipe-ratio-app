'use client';

import { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithCustomToken } from 'firebase/auth';
import { useUserStore } from '@/store/userStore';

declare global {
    interface Window {
        Kakao: any;
    }
}

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Google 로그인에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleKakaoLogin = () => {
        setLoading(true);
        setError(null);

        // Initialize Kakao if not already
        if (!window.Kakao) {
            console.error('Kakao SDK not loaded');
            setError('카카오 로그인을 사용할 수 없습니다. 잠시 후 다시 시도해주세요.');
            setLoading(false);
            return;
        }

        if (!window.Kakao.isInitialized()) {
            const key = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
            if (key) {
                window.Kakao.init(key);
            } else {
                console.error('Kakao Key Missing');
                setError('카카오 설정 오류');
                setLoading(false);
                return;
            }
        }

        window.Kakao.Auth.login({
            success: async function (authObj: any) {
                try {
                    // Send access token to our API
                    const response = await fetch('/api/auth/kakao', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ accessToken: authObj.access_token }),
                    });

                    if (!response.ok) {
                        throw new Error('서버 인증 실패');
                    }

                    const { firebaseCustomToken } = await response.json();
                    const auth = getAuth();
                    await signInWithCustomToken(auth, firebaseCustomToken);
                    onClose();
                } catch (err: any) {
                    setError(err.message || '로그인 처리 중 오류 발생');
                } finally {
                    setLoading(false);
                }
            },
            fail: function (err: any) {
                setError('카카오 로그인 창이 닫혔거나 오류가 발생했습니다.');
                setLoading(false);
                console.error(err);
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold text-center mb-8 text-[#333333]">로그인 / 회원가입</h2>

                <div className="space-y-3">
                    <button
                        onClick={handleKakaoLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#FEE500] text-black rounded-xl font-medium hover:bg-[#FDD835] transition-all"
                    >
                        <span className="text-[#3C1E1E]">💬</span>
                        카카오로 시작하기
                    </button>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                    >
                        <span>Google</span>
                        Google로 계속하기
                    </button>
                </div>

                {error && (
                    <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
                )}

                {loading && (
                    <p className="mt-4 text-sm text-gray-500 text-center">로그인 중...</p>
                )}

            </div>
        </div>
    );
}
