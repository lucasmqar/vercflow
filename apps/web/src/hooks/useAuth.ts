import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, senha: string) => Promise<void>;
    logout: () => void;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: async (email, senha) => {
                try {
                    const response = await fetch('http://localhost:4000/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, senha }),
                    });

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Erro ao fazer login');
                    }

                    const user = await response.json();
                    set({ user, isAuthenticated: true });
                } catch (error) {
                    throw error;
                }
            },
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'vercflow-auth',
        }
    )
);
