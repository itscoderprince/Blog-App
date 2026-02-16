"use client"

import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImagePlus, X, Save, ArrowLeft } from "lucide-react"
import Spinner from "@/components/Spinner"
import { toast } from "sonner"
import slugify from "slugify"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormMessage,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { blogSchema } from "@/lib/zSchema"
import { getEnv } from "@/helpers/getEnv"
import { useCategoryStore } from "@/store/useCategoryStore"
import Editor from "@/components/Editor"

const BlogForm = ({ initialData = null, isEditing = false }) => {
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(initialData?.featuredImage || null)
    const fileInputRef = useRef(null)

    const { categories, fetchCategories } = useCategoryStore()

    useEffect(() => {
        fetchCategories()
    }, [])

    const form = useForm({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            category: initialData?.category || "",
            title: initialData?.title || "",
            slug: initialData?.slug || "",
            blogContent: initialData?.blogContent || "",
        },
    })

    // Auto-generate slug from title
    const blogTitle = form.watch("title")
    useEffect(() => {
        if (blogTitle && !isEditing) {
            form.setValue("slug", slugify(blogTitle, { lower: true }))
        }
    }, [blogTitle, form, isEditing])

    async function onSubmit(values) {
        console.log(values)
        setSubmitting(true)
        try {
            const formData = new FormData()
            Object.keys(values).forEach((key) => {
                if (values[key]) {
                    formData.append(key, values[key])
                }
            })

            if (selectedImage) {
                formData.append("featuredImage", selectedImage)
            }

            const url = isEditing
                ? `${getEnv("VITE_API_BASE_URL")}/blog/update/${initialData._id}`
                : `${getEnv("VITE_API_BASE_URL")}/blog/add`

            const method = isEditing ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                body: formData,
                credentials: "include",
            })

            const result = await res.json()
            if (result.success) {
                toast.success(result.message)
                navigate("/blogs")
            } else {
                toast.error(result.message || "Operation failed")
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedImage(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const removeImage = () => {
        setSelectedImage(null)
        if (previewUrl && !isEditing) {
            URL.revokeObjectURL(previewUrl)
        }
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <Card className="max-w-4xl mx-auto border-none sm:border sm:shadow-sm bg-background py-1 sm:py-3">
            <CardHeader className="flex flex-row items-center justify-between border-b [.border-b]:pb-3 px-2 sm:px-6">
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
                    </CardTitle>
                    <CardDescription>
                        {isEditing ? "Update your blog content and settings." : "Fill in the details to publish a new blog post."}
                    </CardDescription>
                </div>
                <Button variant="ghost" onClick={() => navigate("/blogs")} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blogs
                </Button>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Categories</SelectLabel>
                                                    {categories?.map((cat) => (
                                                        <SelectItem key={cat._id} value={cat.name}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Blog Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter a catchy title..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="blog-post-slug"
                                                {...field}
                                                readOnly={!isEditing}
                                                className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <FormLabel>Featured Image</FormLabel>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 min-h-[160px] ${previewUrl ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50'}`}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />

                                    {previewUrl ? (
                                        <div className="relative w-full max-h-[300px] rounded-lg overflow-hidden group">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white font-medium">Change Image</p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removeImage()
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-primary/10 p-4 rounded-full">
                                                <ImagePlus className="h-8 w-8 text-primary" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-medium text-sm">Click to upload featured image</p>
                                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="blogContent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <div className="prose-editor border rounded-lg overflow-hidden min-h-[400px]">
                                            <Editor
                                                initialData={field.value}
                                                onChange={(event, editor) => {
                                                    const data = editor.getData();
                                                    field.onChange(data);
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4 border-t pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/blogs")}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="min-w-[120px]"
                            >
                                {submitting ? (
                                    <>
                                        <Spinner className="mr-2 h-4 w-4" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        {isEditing ? "Update Blog" : "Publish Blog"}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default BlogForm
