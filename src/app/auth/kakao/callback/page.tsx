'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

function KakaoCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    useEffect(() => {
        if (error) {
            alert('카카오 로그인 실패');
            router.push('/');
            return;
        }

        if (code) {
            const login = async () => {
                try {
                    const response = await fetch('/api/auth/kakao', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code }),
                    });

                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.error || '로그인 실패');
                    }

                    const { firebaseCustomToken } = await response.json();
                    const auth = getAuth();
                    await signInWithCustomToken(auth, firebaseCustomToken);
                    router.push('/');
                } catch (err) {
                    console.error(err);
                    alert('로그인 처리 중 오류가 발생했습니다.');
                    router.push('/');
                }
            };

            login();
        }
    }, [code, error, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F6FA]">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#E67E22] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-['Jua']">로그인 처리 중...</p>
            </div>
        </div>
    );
}

export default function KakaoCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <KakaoCallbackContent />
        </Suspense>
    );
}
