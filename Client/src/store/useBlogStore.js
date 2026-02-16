import { create } from 'zustand'
import { getEnv } from "@/helpers/getEnv"

export const useBlogStore = create((set) => ({
    blogs: [],
    loading: false,
    fetchBlogs: async (category = null, search = null) => {
        set({ loading: true })
        try {
            let url = `${getEnv("VITE_API_BASE_URL")}/blog/all`;
            const params = new URLSearchParams();
            if (category) params.append("category", category);
            if (search) params.append("search", search);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            const res = await fetch(url, {
                credentials: "include",
            })
            const data = await res.json()
            if (data.success) {
                set({ blogs: data.blogs })
            }
        } catch (error) {
            console.error("Error fetching blogs:", error)
        } finally {
            set({ loading: false })
        }
    },
    fetchSingleBlog: async (id) => {
        set({ loading: true })
        try {
            const res = await fetch(`${getEnv("VITE_API_BASE_URL")}/blog/single/${id}`, {
                credentials: "include",
            })
            const data = await res.json()
            if (data.success) {
                return data.blog
            }
        } catch (error) {
            console.error("Error fetching single blog:", error)
        } finally {
            set({ loading: false })
        }
    },
    toggleLike: async (id) => {
        try {
            const res = await fetch(`${getEnv("VITE_API_BASE_URL")}/blog/like/${id}`, {
                method: "PUT",
                credentials: "include",
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error toggling like:", error);
            return { success: false };
        }
    },
    toggleSave: async (id) => {
        try {
            const res = await fetch(`${getEnv("VITE_API_BASE_URL")}/blog/save/${id}`, {
                method: "PUT",
                credentials: "include",
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error toggling save:", error);
            return { success: false };
        }
    },
    fetchComments: async (blogId) => {
        try {
            const res = await fetch(`${getEnv("VITE_API_BASE_URL")}/blog/comments/${blogId}`, {
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                return data.comments;
            }
            return [];
        } catch (error) {
            console.error("Error fetching comments:", error);
            return [];
        }
    },
    addComment: async (blogId, content, parentId = null) => {
        try {
            const res = await fetch(`${getEnv("VITE_API_BASE_URL")}/blog/comment/${blogId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, parentId }),
                credentials: "include",
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error posting comment:", error);
            return { success: false };
        }
    },
}))

