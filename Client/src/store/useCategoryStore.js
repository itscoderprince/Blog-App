import { create } from 'zustand'
import { getEnv } from "@/helpers/getEnv"

export const useCategoryStore = create((set) => ({
    categories: [],
    loading: false,
    error: null,

    fetchCategories: async () => {
        set({ loading: true, error: null })
        try {
            const res = await fetch(`${getEnv("VITE_API_BASE_URL")}/category/all-category`, {
                credentials: "include",
            })
            const result = await res.json()
            if (result.success) {
                set({ categories: result.categories, loading: false })
            } else {
                set({ error: result.message, loading: false })
            }
        } catch (error) {
            set({ error: error.message, loading: false })
        }
    },

    setCategories: (categories) => set({ categories }),
}))
