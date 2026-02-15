import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            loading: false,
            error: null,

            // Actions
            loginStart: () => set({ loading: true, error: null }),
            loginSuccess: (userData) => set({ user: userData, loading: false, error: null }),
            loginFailure: (errorMsg) => set({ error: errorMsg, loading: false }),
            logout: () => set({ user: null, loading: false, error: null }),
        }),
        {
            name: 'blog-auth-storage',
        }
    )
)
