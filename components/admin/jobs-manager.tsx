'use client'

import { useState, useTransition } from 'react'
import { Job, createJob, updateJob, deleteJob } from '@/app/actions/jobs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { Plus, Trash2, Loader2, Pencil } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface JobsManagerProps {
    jobs: Job[]
}

export function JobsManager({ jobs }: JobsManagerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const t = useTranslations('Admin.jobs')

    // Form State
    const [formData, setFormData] = useState<{
        title: string
        description: string
        is_active: boolean
    }>({
        title: '',
        description: '',
        is_active: true
    })
    const [editingId, setEditingId] = useState<string | null>(null)

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            is_active: true
        })
        setEditingId(null)
    }

    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open)
        if (!open) {
            setTimeout(resetForm, 300)
        }
    }

    const handleEdit = (job: Job) => {
        setFormData({
            title: job.title,
            description: job.description,
            is_active: job.is_active
        })
        setEditingId(job.id)
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        startTransition(async () => {
            let result;
            if (editingId) {
                result = await updateJob(editingId, formData)
            } else {
                result = await createJob(formData)
            }

            if (result.success) {
                setIsDialogOpen(false)
                resetForm()
            } else {
                alert(result.message)
            }
        })
    }

    const handleDelete = (id: string) => {
        if (confirm(t('confirmDelete'))) {
            startTransition(async () => {
                const result = await deleteJob(id)
                if (!result.success) {
                    alert(result.message)
                }
            })
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">{t('title')}</h2>
                <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('add')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>{editingId ? t('edit') : t('create')}</DialogTitle>
                            <DialogDescription>
                                {editingId ? 'Modify job details.' : 'Create a new job posting.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('titleLabel')}</label>
                                <Input
                                    placeholder="Job Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="bg-zinc-900 border-zinc-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('description')}</label>
                                <Textarea
                                    placeholder="Job description..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    className="bg-zinc-900 border-zinc-700"
                                    rows={5}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('status')}</label>
                                <div className="flex items-center space-x-2 mt-2">
                                    <input
                                        type="checkbox"
                                        id="is-active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="rounded border-zinc-600 bg-zinc-800 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="is-active" className="text-sm text-zinc-300 select-none cursor-pointer">
                                        {formData.is_active ? t('active') : t('inactive')}
                                    </label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isPending}
                            >
                                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingId ? t('save') : t('create'))}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-950/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400">{t('titleLabel')}</TableHead>
                            <TableHead className="text-zinc-400">{t('status')}</TableHead>
                            <TableHead className="text-right text-zinc-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {jobs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24 text-zinc-500">
                                    No jobs found. Add one above.
                                </TableCell>
                            </TableRow>
                        ) : (
                            jobs.map((job) => (
                                <TableRow key={job.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                    <TableCell className="font-medium text-white">{job.title}</TableCell>
                                    <TableCell className="text-zinc-300">
                                        <span className={`px-2 py-1 rounded text-xs ${job.is_active ? 'bg-green-900/50 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>
                                            {job.is_active ? t('active') : t('inactive')}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(job)}
                                            className="text-zinc-500 hover:text-white"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(job.id)}
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
