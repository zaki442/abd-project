'use client'

import { useState, useTransition } from 'react'
import { createCategory, deleteCategory, updateCategory } from '@/app/actions/admin'
import { ConfirmDeleteDialog } from './confirm-delete-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Trash2, Pencil, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

type Category = {
    id: string
    name: string
}

interface CategoriesManagerProps {
    categories: Category[]
}

export function CategoriesManager({ categories }: CategoriesManagerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const t = useTranslations('Admin.categories')

    const [formData, setFormData] = useState({
        name: ''
    })
    const [editingId, setEditingId] = useState<string | null>(null)

    const resetForm = () => {
        setFormData({ name: '' })
        setEditingId(null)
    }

    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open)
        if (!open) {
            setTimeout(resetForm, 300)
        }
    }

    const handleEdit = (category: Category) => {
        setFormData({ name: category.name })
        setEditingId(category.id)
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name.trim()) {
            return
        }

        startTransition(async () => {
            let result;
            if (editingId) {
                result = await updateCategory(editingId, formData.name)
            } else {
                result = await createCategory(formData.name)
            }

            if (result.success) {
                toast.success(result.message)
                setIsDialogOpen(false)
                resetForm()
            } else {
                toast.error(result.message)
            }
        })
    }

    const handleDelete = (id: string) => {
        startTransition(async () => {
            const result = await deleteCategory(id)
            if (!result.success) {
                toast.error(result.message)
            } else {
                toast.success(result.message)
            }
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Categories</h2>
                <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px] bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                            <DialogDescription>
                                {editingId ? 'Modify category name.' : 'Create a new formation category.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    placeholder="Category Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="bg-zinc-900 border-zinc-700"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isPending}
                            >
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingId ? 'Save Changes' : 'Create Category')}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-950/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400">Name</TableHead>
                            <TableHead className="text-right text-zinc-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center h-24 text-zinc-500">
                                    No categories found. Add one above.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((cat) => (
                                <TableRow key={cat.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                    <TableCell className="font-medium text-white">{cat.name}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(cat)}
                                            className="text-zinc-500 hover:text-white"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <ConfirmDeleteDialog
                                            onConfirm={() => handleDelete(cat.id)}
                                            isPending={isPending}
                                            title="Delete Category"
                                            description={`Are you sure you want to delete the category "${cat.name}"?`}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
