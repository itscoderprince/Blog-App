"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Plus, Trash2, LayoutGrid, Trash, AlertTriangle } from "lucide-react"
import Spinner from "@/components/Spinner"
import { toast } from "sonner"
import { TableSkeleton } from "@/components/TableSkeleton"
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
        <div className="space-y-3 sm:space-y-6 animate-in fade-in duration-500">
            <Card className="border-none shadow-sm bg-background py-2 sm:py-4 gap-2 sm:gap-3">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-3 px-4 sm:px-8 border-b [.border-b]:pb-3 border-border/40 bg-muted/20">
                    <div className="space-y-1.5">
                        <CardTitle className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-3 text-foreground">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <LayoutGrid className="h-6 w-6 text-primary" strokeWidth={2.5} />
                            </div>
                            Categories
                        </CardTitle>
                        <CardDescription className="text-sm font-medium text-muted-foreground/80">
                            Classify and organize your stories with custom tags.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {categories?.length > 0 && (
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteAllOpen(true)}
                                className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all duration-300 font-bold text-xs h-10 px-4 flex-1 md:flex-none shadow-sm"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear All
                            </Button>
                        )}
                        <Button
                            onClick={() => {
                                setEditingCategory(null)
                                form.reset({ name: "", slug: "" })
                                setIsFormOpen(true)
                            }}
                            className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 font-bold text-xs h-10 px-4 flex-1 md:flex-none"
                        >
                            <Plus className="h-4 w-4 mr-2" strokeWidth={3} />
                            Add Tag
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                    {loading ? (
                        <TableSkeleton columns={3} rows={6} />
                    ) : (
                        <div className="rounded-xl border bg-card/50 overflow-x-auto">
                            <div className="min-w-[500px]">
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
                                                <TableRow key={category._id} className="hover:bg-muted/30 transition-all group">
                                                    <TableCell className="font-bold text-sm text-foreground">{category.name}</TableCell>
                                                    <TableCell>
                                                        <span className="text-[11px] font-mono text-muted-foreground/80 bg-muted px-2 py-0.5 rounded border border-border/40 group-hover:border-primary/20 transition-colors">
                                                            {category.slug}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-[#4dbbd3] hover:bg-[#4dbbd3]/5 rounded-lg border border-transparent hover:border-[#4dbbd3]/20 transition-all"
                                                                onClick={() => handleEdit(category)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg border border-transparent hover:border-destructive/20 transition-all"
                                                                onClick={() => handleDeleteClick(category)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
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
                <DialogContent className="sm:max-w-[400px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-destructive/10 p-8 flex flex-col items-center justify-center gap-4 text-center border-b border-destructive/20">
                        <div className="h-16 w-16 rounded-2xl bg-destructive/20 flex items-center justify-center -rotate-3 shadow-inner">
                            <AlertTriangle className="h-8 w-8 text-destructive" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-xl font-black text-destructive tracking-tight uppercase">Delete Category</DialogTitle>
                            <DialogDescription className="text-sm font-bold text-destructive/70">
                                This action is permanent and irreversible.
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="p-6 space-y-4 bg-background">
                        <p className="text-sm text-center font-medium text-muted-foreground px-4">
                            Are you sure you want to delete <span className="font-black text-foreground underline decoration-destructive/30 underline-offset-4">"{categoryToDelete?.name}"</span>?
                        </p>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="rounded-xl h-11 border-border/60 font-bold transition-all hover:bg-muted shadow-sm">
                                Keep it
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete} disabled={submitting} className="rounded-xl h-11 font-black shadow-lg shadow-destructive/20 transition-all active:scale-95">
                                {submitting ? <Spinner className="h-4 w-4" /> : "Yes, Delete"}
                            </Button>
                        </div>
                    </div>
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
        </div >
    )
}

export default Categories