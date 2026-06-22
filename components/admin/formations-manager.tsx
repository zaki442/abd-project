'use client'

import { useState, useTransition } from 'react'
import { createFormation, deleteFormation, updateFormation } from '@/app/actions/admin' // Added updateFormation
import { ConfirmDeleteDialog } from './confirm-delete-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '../ui/textarea'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Loader2, Image as ImageIcon, Pencil } from 'lucide-react' // Added Pencil
import { useTranslations } from 'next-intl'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'

// Define types based on our DB schema
type Category = {
    id: string
    name: string
}

type Formation = {
    id: string
    title: string
    description: string
    date: string
    price: string
    image_url: string
    status: string
    is_certified: boolean
    categories: Category[]
}

interface FormationsManagerProps {
    formations: Formation[]
    categories: Category[]
}

export function FormationsManager({ formations, categories }: FormationsManagerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const t = useTranslations('Admin.formations')

    // Form State
    const [formData, setFormData] = useState<{
        title: string
        description: string
        date: string
        price: string
        category_ids: string[]
        image_url: string
        status: string
        is_certified: boolean
    }>({
        title: '',
        description: '',
        date: '',
        price: '',
        category_ids: [],
        image_url: '',
        status: 'ACTIVE',
        is_certified: false
    })
    const [uploading, setUploading] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null) // Track editing state

    // Handle Image Upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }

        const file = e.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        setUploading(true)

        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )

            const { error: uploadError } = await supabase.storage
                .from('formations')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage
                .from('formations')
                .getPublicUrl(filePath)

            setFormData(prev => ({ ...prev, image_url: data.publicUrl }))
        } catch (error) {
            console.error('Error uploading image: ', error)
            toast.error('Error uploading image')
        } finally {
            setUploading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            date: '',
            price: '',
            category_ids: [],
            image_url: '',
            status: 'ACTIVE',
            is_certified: false
        })
        setEditingId(null)
    }

    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open)
        if (!open) {
            // Delay reset to avoid flickering
            setTimeout(resetForm, 300)
        }
    }

    const handleEdit = (formation: Formation) => {
        setFormData({
            title: formation.title,
            description: formation.description,
            date: formation.date,
            price: formation.price,
            category_ids: formation.categories.map(c => c.id),
            image_url: formation.image_url,
            status: formation.status || 'ACTIVE',
            is_certified: formation.is_certified || false
        })
        setEditingId(formation.id)
        setIsDialogOpen(true)
    }

    const handleCategoryToggle = (categoryId: string) => {
        setFormData(prev => {
            const current = prev.category_ids
            if (current.includes(categoryId)) {
                return { ...prev, category_ids: current.filter(id => id !== categoryId) }
            } else {
                return { ...prev, category_ids: [...current, categoryId] }
            }
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.image_url) {
            toast.error('Please upload an image')
            return
        }

        startTransition(async () => {
            let result;
            if (editingId) {
                result = await updateFormation(editingId, formData)
            } else {
                result = await createFormation(formData)
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
            const result = await deleteFormation(id)
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
                <h2 className="text-xl font-semibold text-white">Formations</h2>
                <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Formation
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-white max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit Formation' : 'Add New Formation'}</DialogTitle>
                            <DialogDescription>
                                {editingId ? 'Modify formation details.' : 'Create a new formation. Upload an image and fill in the details.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title</label>
                                    <Input
                                        placeholder="Formation Title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="bg-zinc-900 border-zinc-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Date</label>
                                    <Input
                                        placeholder="e.g. October 2024"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                        className="bg-zinc-900 border-zinc-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    placeholder="Brief description..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    className="bg-zinc-900 border-zinc-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price</label>
                                <Input
                                    placeholder="e.g. Free or 100 USD"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                    className="bg-zinc-900 border-zinc-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger className="bg-zinc-900 border-zinc-700">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Active (Shown)</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive (Hidden)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-md bg-zinc-900 border border-zinc-700">
                                <label className="text-sm font-medium cursor-pointer">Certified Formation</label>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, is_certified: !formData.is_certified })}
                                    className={`relative w-11 h-6 rounded-full transition-colors ${
                                        formData.is_certified ? 'bg-amber-500' : 'bg-zinc-700'
                                    }`}
                                >
                                    <span
                                        className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                                            formData.is_certified ? 'translate-x-[22px]' : 'translate-x-[2px]'
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Categories</label>
                                <div className="grid grid-cols-2 gap-2 bg-zinc-900 p-3 rounded-md border border-zinc-700">
                                    {categories.map((cat) => (
                                        <div key={cat.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`cat-${cat.id}`}
                                                className="rounded border-zinc-600 bg-zinc-800 text-primary focus:ring-primary"
                                                checked={formData.category_ids.includes(cat.id)}
                                                onChange={() => handleCategoryToggle(cat.id)}
                                            />
                                            <label
                                                htmlFor={`cat-${cat.id}`}
                                                className="text-sm text-zinc-300 cursor-pointer select-none"
                                            >
                                                {cat.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image</label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="bg-zinc-900 border-zinc-700 cursor-pointer"
                                    />
                                    {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {formData.image_url && !uploading && (
                                        <div className="h-10 w-10 relative bg-zinc-800 rounded overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isPending || uploading}
                            >
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingId ? 'Save Changes' : 'Create Formation')}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-950/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400">Image</TableHead>
                            <TableHead className="text-zinc-400">Title</TableHead>
                            <TableHead className="text-zinc-400">Category</TableHead>
                            <TableHead className="text-zinc-400">Date</TableHead>
                            <TableHead className="text-zinc-400">Status</TableHead>
                            <TableHead className="text-zinc-400">Certified</TableHead>
                            <TableHead className="text-right text-zinc-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {formations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-zinc-500">
                                    No formations found. Add one above.
                                </TableCell>
                            </TableRow>
                        ) : (
                            formations.map((f) => (
                                <TableRow key={f.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                    <TableCell>
                                        <div className="h-10 w-16 bg-zinc-800 rounded overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={f.image_url} alt={f.title} className="h-full w-full object-cover" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-white">{f.title}</TableCell>
                                    <TableCell className="text-zinc-300">
                                        {f.categories && f.categories.length > 0
                                            ? f.categories.map(c => c.name).join(', ')
                                            : 'Uncategorized'}
                                    </TableCell>
                                    <TableCell className="text-zinc-300">{f.date}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            f.status === 'ACTIVE' 
                                                ? 'bg-emerald-500/10 text-emerald-500' 
                                                : 'bg-zinc-500/10 text-zinc-500'
                                        }`}>
                                            {f.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {f.is_certified ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
                                                Certified
                                            </span>
                                        ) : (
                                            <span className="text-zinc-600">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(f)}
                                            className="text-zinc-500 hover:text-white"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <ConfirmDeleteDialog
                                            onConfirm={() => handleDelete(f.id)}
                                            isPending={isPending}
                                            title="Delete Formation"
                                            description={`Are you sure you want to delete the formation "${f.title}"?`}
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
