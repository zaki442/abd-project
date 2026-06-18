'use client'

import { useState, useTransition } from 'react'
import { createBlog, deleteBlog, updateBlog, ensureBlogsBucket } from '@/app/actions/admin'
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
import { Plus, Trash2, Loader2, ImageIcon, Pencil, FileText } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'

type Blog = {
    id: string
    title: string
    content: string
    image_url: string | null
    author: string
    status: string
    created_at: string
}

interface BlogsManagerProps {
    blogs: Blog[]
}

export function BlogsManager({ blogs }: BlogsManagerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image_url: '',
        author: '',
        status: 'DRAFT',
    })
    const [uploading, setUploading] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

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
                .from('blogs')
                .upload(filePath, file)

            if (uploadError?.message?.includes('Bucket not found')) {
                await ensureBlogsBucket()
                const { error: retryError } = await supabase.storage
                    .from('blogs')
                    .upload(filePath, file)
                if (retryError) throw retryError
            } else if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage
                .from('blogs')
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
            content: '',
            image_url: '',
            author: '',
            status: 'DRAFT',
        })
        setEditingId(null)
    }

    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open)
        if (!open) {
            setTimeout(resetForm, 300)
        }
    }

    const handleEdit = (blog: Blog) => {
        setFormData({
            title: blog.title,
            content: blog.content,
            image_url: blog.image_url || '',
            author: blog.author,
            status: blog.status,
        })
        setEditingId(blog.id)
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title || !formData.content || !formData.author) {
            toast.error('Please fill in all required fields')
            return
        }

        startTransition(async () => {
            const payload = {
                ...formData,
                image_url: formData.image_url || null,
            }

            let result
            if (editingId) {
                result = await updateBlog(editingId, payload)
            } else {
                result = await createBlog(payload)
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
            const result = await deleteBlog(id)
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
                <h2 className="text-xl font-semibold text-white">Blog Posts</h2>
                <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Blog Post
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-zinc-800 text-white max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingId ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
                            <DialogDescription>
                                {editingId ? 'Modify blog post details.' : 'Create a new blog post for the community.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Title</label>
                                    <Input
                                        placeholder="Blog Title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="bg-zinc-900 border-zinc-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Author</label>
                                    <Input
                                        placeholder="Author Name"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        required
                                        className="bg-zinc-900 border-zinc-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Content</label>
                                <Textarea
                                    placeholder="Write your blog content here..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
                                    className="bg-zinc-900 border-zinc-700 min-h-[200px]"
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
                                        <SelectItem value="DRAFT">Draft</SelectItem>
                                        <SelectItem value="PUBLISHED">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image (optional)</label>
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
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingId ? 'Save Changes' : 'Create Blog Post')}
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
                            <TableHead className="text-zinc-400">Author</TableHead>
                            <TableHead className="text-zinc-400">Date</TableHead>
                            <TableHead className="text-zinc-400">Status</TableHead>
                            <TableHead className="text-right text-zinc-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {blogs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-zinc-500">
                                    No blog posts found. Add one above.
                                </TableCell>
                            </TableRow>
                        ) : (
                            blogs.map((blog) => (
                                <TableRow key={blog.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                    <TableCell>
                                        {blog.image_url ? (
                                            <div className="h-10 w-16 bg-zinc-800 rounded overflow-hidden">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={blog.image_url} alt={blog.title} className="h-full w-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="h-10 w-16 bg-zinc-800 rounded flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-zinc-500" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium text-white max-w-[200px] truncate">{blog.title}</TableCell>
                                    <TableCell className="text-zinc-300">{blog.author}</TableCell>
                                    <TableCell className="text-zinc-300">
                                        {new Date(blog.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            blog.status === 'PUBLISHED'
                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                : 'bg-amber-500/10 text-amber-500'
                                        }`}>
                                            {blog.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(blog)}
                                            className="text-zinc-500 hover:text-white"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <ConfirmDeleteDialog
                                            onConfirm={() => handleDelete(blog.id)}
                                            isPending={isPending}
                                            title="Delete Blog Post"
                                            description={`Are you sure you want to delete "${blog.title}"?`}
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
