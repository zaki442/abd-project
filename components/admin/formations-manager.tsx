'use client'

import { useState, useTransition } from 'react'
import { createFormation, deleteFormation } from '@/app/actions/admin'
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
import { Plus, Trash2, Loader2, Image as ImageIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createBrowserClient } from '@supabase/ssr'

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
    category_id: string
    category?: Category
}

interface FormationsManagerProps {
    formations: Formation[]
    categories: Category[]
}

export function FormationsManager({ formations, categories }: FormationsManagerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const t = useTranslations('Admin.formations') // Assuming you'll add these keys

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        price: '',
        category_id: '',
        image_url: ''
    })
    const [uploading, setUploading] = useState(false)

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
                .from('formations') // Make sure this bucket exists
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
            alert('Error uploading image')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.image_url) {
            alert('Please upload an image')
            return
        }

        startTransition(async () => {
            const result = await createFormation(formData)
            if (result.success) {
                setIsDialogOpen(false)
                setFormData({
                    title: '',
                    description: '',
                    date: '',
                    price: '',
                    category_id: '',
                    image_url: ''
                })
            } else {
                alert(result.message)
            }
        })
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this formation?')) {
            startTransition(async () => {
                const result = await deleteFormation(id)
                if (!result.success) {
                    alert(result.message)
                }
            })
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Formations</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Formation
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>Add New Formation</DialogTitle>
                            <DialogDescription>
                                Create a new formation. Upload an image and fill in the details.
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

                            <div className="grid grid-cols-2 gap-4">
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
                                    <label className="text-sm font-medium">Category</label>
                                    <Select
                                        value={formData.category_id}
                                        onValueChange={(val) => setFormData({ ...formData, category_id: val })}
                                        required
                                    >
                                        <SelectTrigger className="bg-zinc-900 border-zinc-700">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Formation'}
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
                                    <TableCell className="text-zinc-300">{f.category?.name || 'Uncategorized'}</TableCell>
                                    <TableCell className="text-zinc-300">{f.date}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(f.id)}
                                            className="text-zinc-500 hover:text-red-500 hover:bg-red-950/20"
                                            disabled={isPending}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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
