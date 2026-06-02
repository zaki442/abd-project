'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Trash2, Loader2, MessageSquare } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { deleteFeedback } from '@/app/actions/feedbacks'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface Feedback {
    id: string
    created_at: string
    full_name: string
    role: string | null
    feedback: string
}

export function FeedbacksManager({ feedbacks: initialFeedbacks }: { feedbacks: Feedback[] }) {
    const t = useTranslations('AdminFeedbacks')
    const tAdmin = useTranslations('Admin')
    
    const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks)
    const [searchQuery, setSearchQuery] = useState('')
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null)

    // Filter feedbacks based on search
    const filteredFeedbacks = feedbacks.filter(fb =>
        fb.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.feedback.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fb.role && fb.role.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const handleDelete = async () => {
        if (!feedbackToDelete) return

        setIsDeleting(feedbackToDelete)
        try {
            const result = await deleteFeedback(feedbackToDelete)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Feedback deleted successfully')
                setFeedbacks(prev => prev.filter(fb => fb.id !== feedbackToDelete))
            }
        } catch (error) {
            toast.error('Failed to delete feedback')
        } finally {
            setIsDeleting(null)
            setFeedbackToDelete(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">{t('title')}</h1>
                    <p className="text-sm text-zinc-400">
                        {tAdmin('table.total')}: {filteredFeedbacks.length}
                    </p>
                </div>
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder={tAdmin('table.search')}
                        className="pl-8 bg-zinc-900 border-zinc-800 text-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/50">
                <Table>
                    <TableHeader className="bg-zinc-900/50">
                        <TableRow className="border-zinc-800 hover:bg-transparent">
                            <TableHead className="text-zinc-400">{tAdmin('table.date')}</TableHead>
                            <TableHead className="text-zinc-400">{tAdmin('table.fullName')}</TableHead>
                            <TableHead className="text-zinc-400">{t('role')}</TableHead>
                            <TableHead className="text-zinc-400 max-w-[400px]">Feedback</TableHead>
                            <TableHead className="text-right text-zinc-400">{tAdmin('table.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredFeedbacks.length === 0 ? (
                            <TableRow className="border-zinc-800 hover:bg-transparent">
                                <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                                    {tAdmin('table.noResults')}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredFeedbacks.map((fb) => (
                                <TableRow key={fb.id} className="border-zinc-800 hover:bg-zinc-800/50">
                                    <TableCell className="text-zinc-300 font-medium">
                                        {format(new Date(fb.created_at), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-zinc-300">
                                        {fb.full_name}
                                    </TableCell>
                                    <TableCell className="text-zinc-400 text-sm">
                                        {fb.role || '-'}
                                    </TableCell>
                                    <TableCell className="text-zinc-300 max-w-[400px]">
                                        <p className="line-clamp-3 text-sm">{fb.feedback}</p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setFeedbackToDelete(fb.id)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                            disabled={isDeleting === fb.id}
                                        >
                                            {isDeleting === fb.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!feedbackToDelete} onOpenChange={(open) => !open && setFeedbackToDelete(null)}>
                <DialogContent className="bg-zinc-950 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-white">{t('delete')}</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            {t('confirmDelete')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setFeedbackToDelete(null)}
                            className="bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="bg-red-500 text-white hover:bg-red-600"
                        >
                            {t('delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
