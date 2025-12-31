import { useEffect, useState } from 'react';

export function useServiceWorkerUpdate() {
    const [hasUpdate, setHasUpdate] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            (window as any).workbox !== undefined
        ) {
            const wb = (window as any).workbox;

            wb.addEventListener('waiting', () => {
                setHasUpdate(true);
                // Start countdown immediately when update is found
                setCountdown(5);
            });

            wb.register();
        }
    }, []);

    useEffect(() => {
        if (countdown === null) return;

        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown((prev) => (prev !== null ? prev - 1 : null));
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            // Countdown finished, trigger update
            triggerRefresh();
        }
    }, [countdown]);

    const triggerRefresh = () => {
        if (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            (window as any).workbox !== undefined
        ) {
            const wb = (window as any).workbox;
            wb.messageSkipWaiting();
            // Reload page when new SW controls the page
            wb.addEventListener('controlling', () => {
                window.location.reload();
            });
        }
    };

    return { hasUpdate, countdown, triggerRefresh };
}
