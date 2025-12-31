'use client';

import Link from "next/link";

export function OfflineContent() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
            <div className="text-6xl mb-6">📶</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2 font-jua">
                오프라인 상태입니다
            </h1>
            <p className="text-gray-600 mb-8 max-w-xs">
                인터넷 연결을 확인해주세요.
                <br />
                연결되면 자동으로 레시피가 동기화됩니다.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-md active:scale-95 mb-4"
            >
                다시 시도하기
            </button>
            <Link
                href="/"
                className="text-[#FF6B6B] font-bold hover:underline"
            >
                홈으로 돌아가기
            </Link>
        </div>
    );
}
