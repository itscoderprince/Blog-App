"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import BlogForm from "./BlogForm"
import { getEnv } from "@/helpers/getEnv"
import { toast } from "sonner"
import Loading from "@/components/Loading"

const EditBlog = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(`${getEnv("VITE_API_BASE_URL")}/blog/single/${id}`, {
                    credentials: "include",
                })
                const data = await res.json()
                if (data.success) {
                    setBlog(data.blog)
                } else {
                    toast.error(data.message || "Failed to fetch blog")
                    navigate("/blogs")
                }
            } catch (error) {
                toast.error("Error fetching blog details")
                navigate("/blogs")
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchBlog()
        }
    }, [id, navigate])

    if (loading) return <div className="py-20"><Loading fullPage={false} /></div>

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {blog && <BlogForm initialData={blog} isEditing={true} />}
        </div>
    )
}

export default EditBlog
