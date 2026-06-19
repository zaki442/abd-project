'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Trash2, Loader2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
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
import { ConfirmDeleteDialog } from './confirm-delete-dialog'

interface Feedback {
    id: string
    created_at: string
    full_name: string
    email: string | null
    role: string | null
    feedback: string
    image_url?: string | null
}

export function FeedbacksManager({ feedbacks: initialFeedbacks }: { feedbacks: Feedback[] }) {
    const t = useTranslations('AdminFeedbacks')
    const tAdmin = useTranslations('Admin')
    
    const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks)
    const [searchQuery, setSearchQuery] = useState('')
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null)

    // Filter feedbacks based on search
    const filteredFeedbacks = feedbacks.filter(fb =>
        fb.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fb.feedback.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fb.role && fb.role.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const handleDelete = async (id: string) => {
        setIsDeleting(id)
        try {
            const result = await deleteFeedback(id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Feedback deleted successfully')
                setFeedbacks(prev => prev.filter(fb => fb.id !== id))
            }
        } catch (error) {
            toast.error('Failed to delete feedback')
        } finally {
            setIsDeleting(null)
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
                            <TableHead className="text-zinc-400">{tAdmin('table.email')}</TableHead>
                            <TableHead className="text-zinc-400">{t('role')}</TableHead>
                            <TableHead className="text-zinc-400">Image</TableHead>
                            <TableHead className="text-zinc-400 max-w-[400px]">Feedback</TableHead>
                            <TableHead className="text-right text-zinc-400">{tAdmin('table.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredFeedbacks.length === 0 ? (
                            <TableRow className="border-zinc-800 hover:bg-transparent">
                                <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
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
                                        {fb.email || '-'}
                                    </TableCell>
                                    <TableCell className="text-zinc-400 text-sm">
                                        {fb.role || '-'}
                                    </TableCell>
                                    <TableCell className="text-zinc-300">
                                        {fb.image_url ? (
                                            <img
                                                src={fb.image_url}
                                                alt={`${fb.full_name} feedback image`}
                                                className="h-14 w-14 rounded-md border border-zinc-800 object-cover"
                                            />
                                        ) : (
                                            <span className="text-zinc-500">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-zinc-300 max-w-[400px]">
                                        <div className="flex items-start gap-2">
                                            <p className={`text-sm ${expandedFeedback === fb.id ? '' : 'line-clamp-1'}`}>{fb.feedback}</p>
                                            <button
                                                onClick={() => setExpandedFeedback(expandedFeedback === fb.id ? null : fb.id)}
                                                className="shrink-0 mt-0.5 text-zinc-500 hover:text-white transition-colors"
                                                title={expandedFeedback === fb.id ? 'Show less' : 'Show full message'}
                                            >
                                                {expandedFeedback === fb.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ConfirmDeleteDialog
                                            onConfirm={() => handleDelete(fb.id)}
                                            isPending={isDeleting === fb.id}
                                            title={t('delete')}
                                            description={t('confirmDelete')}
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
