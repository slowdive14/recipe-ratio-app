'use client';

import { useServiceWorkerUpdate } from '@/hooks/useServiceWorkerUpdate';
import { useEffect, useState } from 'react';

export function UpdateNotification() {
    const { hasUpdate, countdown, triggerRefresh } = useServiceWorkerUpdate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (hasUpdate) {
            setVisible(true);
        }
    }, [hasUpdate]);

    if (!visible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white border-2 border-[#FFC8A2] rounded-2xl shadow-lg p-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="flex items-start gap-4">
                <div className="text-2xl">🎉</div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">새로운 버전이 있어요!</h3>
                    <p className="text-gray-600 text-sm mb-3">
                        더 멋진 기능이 추가되었어요.
                        <br />
                        <span className="font-bold text-[#FF6B6B]">
                            {countdown}초 후
                        </span> 자동으로 업데이트됩니다.
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={triggerRefresh}
                            className="flex-1 bg-[#FF6B6B] hover:bg-[#FF5252] text-white text-sm font-bold py-2 px-4 rounded-xl transition-colors"
                        >
                            지금 업데이트
                        </button>
                        <button
                            onClick={() => setVisible(false)}
                            className="px-3 text-gray-400 hover:text-gray-600 font-bold"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
