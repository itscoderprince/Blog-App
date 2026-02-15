"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Plus, Trash2, LayoutGrid, Trash, AlertTriangle } from "lucide-react"
import Spinner from "@/components/Spinner"
import { toast } from "sonner"
import slugify from "slugify"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field, FieldGroup } from "@/components/ui/field"
import { categorySchema } from "@/lib/zSchema"
import { getEnv } from "@/helpers/getEnv"
import { useCategoryStore } from "@/store/useCategoryStore"
import Loading from "@/components/Loading"

const Categories = () => {
    // Dialog States
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false)

    // Data States
    const [submitting, setSubmitting] = useState(false)
    const [editingCategory, setEditingCategory] = useState(null)
    const [categoryToDelete, setCategoryToDelete] = useState(null)

    const { categories, loading, fetchCategories } = useCategoryStore()

    useEffect(() => {
        fetchCategories()
    }, [])

    const form = useForm({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            slug: "",
        },
    })

    // Auto-generate slug from name
    const categoryName = form.watch("name")
    useEffect(() => {
        if (categoryName) {
            form.setValue("slug", slugify(categoryName, { lower: true }))
        }
    }, [categoryName, form])

    async function onSubmit(values) {
        setSubmitting(true)
        try {
            const url = editingCategory
                ? `${getEnv("VITE_API_BASE_URL")}/category/update/${editingCategory._id}`
                : `${getEnv("VITE_API_BASE_URL")}/category/add`

            const method = editingCategory ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            const result = await res.json()
            if (result.success) {
                toast.success(result.message)
                form.reset()
                setIsFormOpen(false)
                setEditingCategory(null)
                fetchCategories()
            } else {
                toast.error(result.message || "Operation failed")
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleEdit = (category) => {
        setEditingCategory(category)
        form.reset({
            name: category.name,
            slug: category.slug,
        })
        setIsFormOpen(true)
    }

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category)
        setIsDeleteOpen(true)
    }

    const confirmDelete = async () => {
        if (!categoryToDelete) return
        setSubmitting(true)
        try {
            const res = await fetch(`${getEnv("VITE_API_BASE_URL")}/category/delete/${categoryToDelete._id}`, {
                method: "DELETE",
            })
            const result = await res.json()
            if (result.success) {
                toast.success(result.message)
                setIsDeleteOpen(false)
                setCategoryToDelete(null)
                fetchCategories()
            } else {
                toast.error(result.message || "Delete failed")
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    const confirmDeleteAll = async () => {
        setSubmitting(true)
        try {
            const res = await fetch(`${getEnv("VITE_API_BASE_URL")}/category/delete-all`, {
                method: "DELETE",
            })
            const result = await res.json()
            if (result.success) {
                toast.success(result.message)
                setIsDeleteAllOpen(false)
                fetchCategories()
            } else {
                toast.error(result.message || "Delete all failed")
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="border-none shadow-sm bg-background py-4 gap-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <LayoutGrid className="h-6 w-6 text-primary" />
                            Manage Categories
                        </CardTitle>
                        <CardDescription>
                            Organize your blog content with custom categories.
                        </CardDescription>
                    </div>
                    <CardAction className="flex gap-2">
                        {categories?.length > 0 && (
                            <Button
                                variant="destructive"
                                onClick={() => setIsDeleteAllOpen(true)}
                                className="rounded-full shadow-sm transition-all hover:shadow-md hover:scale-105 active:scale-95"
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete All
                            </Button>
                        )}
                        <Button
                            onClick={() => {
                                setEditingCategory(null)
                                form.reset({ name: "", slug: "" })
                                setIsFormOpen(true)
                            }}
                            className="rounded-full shadow-sm transition-all hover:shadow-md hover:scale-105 active:scale-95"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add New
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <Loading fullPage={false} />
                    ) : (
                        <div className="rounded-xl border bg-card/50 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/40">
                                    <TableRow>
                                        <TableHead className="font-semibold py-4">Category Name</TableHead>
                                        <TableHead className="font-semibold py-4">Slug</TableHead>
                                        <TableHead className="text-right font-semibold py-4">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories?.length > 0 ? (
                                        categories.map((category) => (
                                            <TableRow key={category._id} className="hover:bg-muted/20 transition-all group">
                                                <TableCell className="font-medium">{category.name}</TableCell>
                                                <TableCell className="text-muted-foreground font-mono text-xs tracking-tight">{category.slug}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2 pr-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
                                                            onClick={() => handleEdit(category)}
                                                        >
                                                            <Edit className="h-4.5 w-4.5" />
                                                            <span className="sr-only">Edit</span>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-full transition-colors"
                                                            onClick={() => handleDeleteClick(category)}
                                                        >
                                                            <Trash2 className="h-4.5 w-4.5" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-48 text-center">
                                                <div className="flex flex-col items-center justify-center gap-3 py-10">
                                                    <div className="bg-muted/30 p-4 rounded-full">
                                                        <LayoutGrid className="h-10 w-10 text-muted-foreground/40" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text font-medium text-muted-foreground">No categories yet</p>
                                                        <p className="text-sm text-muted-foreground/60">Start adding categories to organize your blog.</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* --- DIALOGS --- */}
            {/* Add/Edit Form Dialog - Reverted to normal theme */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-sm p-0 overflow-hidden">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <DialogHeader className="px-6 pt-4 pb-1">
                                <DialogTitle className="text-lg font-semibold tracking-tight">
                                    {editingCategory ? "Edit Category" : "New Category"}
                                </DialogTitle>
                                <DialogDescription className="text-sm mt-1">
                                    {editingCategory
                                        ? "Make changes to your category here. Click save when you're done."
                                        : "Fill in the details for your new category. Click save when you're done."}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="px-6 py-2 border-b">
                                <FieldGroup className="gap-5">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <Field>
                                                <Label htmlFor="cat-name" className="text-sm font-medium">Name</Label>
                                                <FormControl>
                                                    <Input
                                                        id="cat-name"
                                                        placeholder="Category name"
                                                        className="h-9"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-destructive text-[10px]" />
                                            </Field>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <Field>
                                                <Label htmlFor="cat-slug" className="text-sm font-medium">Slug</Label>
                                                <FormControl>
                                                    <Input
                                                        id="cat-slug"
                                                        placeholder="category-slug"
                                                        className="h-9 bg-muted/50 cursor-not-allowed"
                                                        {...field}
                                                        readOnly
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-destructive text-[10px]" />
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </div>

                            <DialogFooter className="px-6 py-2 flex flex-row items-center justify-end gap-2 bg-muted/30">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-9 px-4 rounded-lg text-xs font-medium"
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="h-9 px-4 rounded-lg text-xs font-medium"
                                >
                                    {submitting ? <Spinner className="h-3 w-3 mr-2" /> : null}
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Individual Delete Confirm Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader className="flex flex-col items-center text-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                        </div>
                        <DialogTitle>Delete Category</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-bold text-foreground">"{categoryToDelete?.name}"</span>?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center gap-3 pt-4">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="rounded-full">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={submitting} className="rounded-full">
                            {submitting ? <Spinner className="h-4 w-4" /> : "Yes, Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete All Confirm Dialog */}
            <Dialog open={isDeleteAllOpen} onOpenChange={setIsDeleteAllOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader className="flex flex-col items-center text-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                            <Trash2 className="h-6 w-6 text-destructive" />
                        </div>
                        <DialogTitle>Clear All Categories</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-bold text-destructive">ALL</span> categories?
                            Your entire category list will be wiped clean. This is irreversible!
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center gap-3 pt-4">
                        <Button variant="outline" onClick={() => setIsDeleteAllOpen(false)} className="rounded-full">
                            Wait, Go Back
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteAll} disabled={submitting} className="rounded-full font-bold">
                            {submitting ? <Spinner className="h-4 w-4" /> : "Yes, Delete Everything"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Categories