import { create } from 'zustand';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { getAuth } from '@/lib/firebase';

interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
    initializeUser: () => () => void; // Returns unsubscribe function
    signOut: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    loading: true,
    error: null,

    initializeUser: () => {
        set({ loading: true });
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                set({ user, loading: false, error: null });
            },
            (error) => {
                set({ error: error.message, loading: false });
            }
        );

        return unsubscribe;
    },

    signOut: async () => {
        try {
            const auth = getAuth();
            await firebaseSignOut(auth);
            set({ user: null });
        } catch (error) {
            set({ error: (error as Error).message });
        }
    },
}));
