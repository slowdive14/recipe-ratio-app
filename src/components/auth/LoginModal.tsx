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

        // SDK v2 uses authorize() which redirects to Kakao login page
        // After login, Kakao will redirect back to our redirectUri with an authorization code
        window.Kakao.Auth.authorize({
            redirectUri: `${window.location.origin}/auth/kakao/callback`,
            scope: 'profile_nickname,profile_image',
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
                        className="w-full flex items-center justify-center gap-3 py-3 bg-[#FEE500] text-[#000000] rounded-xl font-medium hover:bg-[#FDD835] transition-all"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 4C7.02944 4 3 7.16451 3 11.0909C3 13.5728 4.64939 15.7496 7.13259 17.0167L6.26339 20.4635C6.19149 20.7438 6.51989 20.9645 6.76579 20.8024L10.8797 18.0711C11.2453 18.1165 11.6192 18.1818 12 18.1818C16.9706 18.1818 21 15.0173 21 11.0909C21 7.16451 16.9706 4 12 4Z" fill="#000000"/>
                        </svg>
                        카카오로 시작하기
                    </button>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
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
