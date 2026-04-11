'use client'

import { useTransition } from 'react'
import { JobRegistration, deleteJobRegistration } from '@/app/actions/jobs'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Trash2, Loader2, Eye } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface JobRegistrationsManagerProps {
    registrations: JobRegistration[]
}

export function JobRegistrationsManager({ registrations }: JobRegistrationsManagerProps) {
    const [isPending, startTransition] = useTransition()
    const t = useTranslations('Admin.jobRegistrations')

    const handleDelete = (id: string) => {
        if (confirm(t('confirmDelete'))) {
            startTransition(async () => {
                const result = await deleteJobRegistration(id)
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
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-950/50">
                <Table>
                    <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-zinc-900/50">
                            <TableHead className="text-zinc-400">Date</TableHead>
                            <TableHead className="text-zinc-400">Job</TableHead>
                            <TableHead className="text-zinc-400">Applicant</TableHead>
                            <TableHead className="text-zinc-400">Contact</TableHead>
                            <TableHead className="text-zinc-400">{t('coverLetter')}</TableHead>
                            <TableHead className="text-right text-zinc-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {registrations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-zinc-500">
                                    No applications found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            registrations.map((reg) => (
                                <TableRow key={reg.id} className="border-zinc-800 hover:bg-zinc-900/50">
                                    <TableCell className="text-zinc-300">
                                        {new Date(reg.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="font-medium text-white">
                                        {reg.job?.title || 'Unknown Job'}
                                    </TableCell>
                                    <TableCell className="text-zinc-300">
                                        {reg.full_name}
                                    </TableCell>
                                    <TableCell className="text-zinc-300">
                                        <div className="flex flex-col text-sm">
                                            <span>{reg.email}</span>
                                            {reg.phone_number && <span className="text-zinc-500">{reg.phone_number}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {reg.cover_letter ? (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="bg-transparent border-zinc-700 hover:bg-zinc-800">
                                                        <Eye className="w-4 h-4 mr-2" /> Read
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-h-[80vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Cover Letter from {reg.full_name}</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="mt-4 whitespace-pre-wrap text-zinc-300 leading-relaxed">
                                                        {reg.cover_letter}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        ) : (
                                            <span className="text-zinc-500 italic">None</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(reg.id)}
                                            className="text-zinc-500 hover:text-red-500 hover:bg-red-950/20"
                                            disabled={isPending}
                                        >
                                            {isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
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
