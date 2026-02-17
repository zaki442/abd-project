'use client'

import { useState, useTransition } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { deleteRegistration } from '@/app/actions/admin'
import { RegistrationDialog } from './registration-dialog'
import { toast } from 'sonner'
import { Trash2, Search, Loader2, Download } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Registration {
    id: string
    created_at: string
    full_name: string
    email: string
    phone_number?: string
    motivation?: string
    formation_id: string
}

interface Formation {
    id: string
    title: string
}

interface RegistrationsTableProps {
    initialRegistrations: Registration[]
    formations: Formation[]
}

export function RegistrationsTable({ initialRegistrations, formations }: RegistrationsTableProps) {
    const [registrations, setRegistrations] = useState(initialRegistrations)
    const [searchQuery, setSearchQuery] = useState('')
    const [isPending, startTransition] = useTransition()
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const t = useTranslations('Admin.table')
    const ft = useTranslations('Formations.items')

    const getFormationTitle = (id: string) => {
        const formation = formations.find(f => f.id === id)
        if (formation) return formation.title

        // Fallback for hardcoded legacy IDs if needed
        if (id === 'agile-darija') return ft('agile-darija.title')
        if (id === 'mindset') return ft('mindset.title')
        if (id === 'agile-teamwork') return ft('teamwork.title')
        if (id === 'design-thinking') return ft('design-thinking.title')

        return id
    }

    const filteredRegistrations = registrations.filter((reg) => {
        const formationTitle = getFormationTitle(reg.formation_id).toLowerCase()

        return (
            reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (reg.phone_number?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
            formationTitle.includes(searchQuery.toLowerCase())
        )
    })

    const handleDelete = async (id: string) => {
        if (!confirm(t('confirmDelete'))) return

        setDeletingId(id)
        startTransition(async () => {
            const result = await deleteRegistration(id)
            if (result.success) {
                toast.success(result.message)
                setRegistrations((prev) => prev.filter((r) => r.id !== id))
            } else {
                toast.error(result.message)
            }
            setDeletingId(null)
        })
    }

    const handleCreateSuccess = () => {
        // Trigger a page refresh to get fresh data
        window.location.reload()
    }

    const handleEditSuccess = (updated: Registration) => {
        setRegistrations((prev) =>
            prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
        )
    }

    const exportToCSV = () => {
        const headers = [`ID,${t('date')},${t('fullName')},${t('email')},${t('phoneNumber')},${t('motivation')},${t('formation')}`]
        const rows = filteredRegistrations.map(reg => {
            const formationName = getFormationTitle(reg.formation_id).replace(/"/g, '""')
            return `${reg.id},${reg.created_at},"${reg.full_name}",${reg.email},${reg.phone_number || ''},"${(reg.motivation || '').replace(/"/g, '""')}", "${formationName}"`
        })

        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n")
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "registrations.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="ps-9"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                        {t('total')}: {filteredRegistrations.length}
                    </div>
                    <Button variant="outline" size="sm" onClick={exportToCSV}>
                        <Download className="me-2 h-4 w-4" />
                        {t('exportCSV')}
                    </Button>
                    <RegistrationDialog mode="create" onSuccess={handleCreateSuccess} />
                </div>
            </div>

            <div className="rounded-md border bg-zinc-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">{t('date')}</TableHead>
                            <TableHead>{t('fullName')}</TableHead>
                            <TableHead>{t('email')}</TableHead>
                            <TableHead>{t('phoneNumber')}</TableHead>
                            <TableHead>{t('formation')}</TableHead>
                            <TableHead className="text-end">{t('actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRegistrations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    {t('noResults')}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRegistrations.map((reg) => (
                                <TableRow key={reg.id}>
                                    <TableCell className="font-medium">
                                        {new Date(reg.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{reg.full_name}</TableCell>
                                    <TableCell>{reg.email}</TableCell>
                                    <TableCell>{reg.phone_number || '-'}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                            {getFormationTitle(reg.formation_id)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-end">
                                        <div className="flex justify-end gap-1">
                                            <RegistrationDialog
                                                mode="edit"
                                                registration={reg}
                                                onSuccess={handleEditSuccess}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(reg.id)}
                                                disabled={isPending && deletingId === reg.id}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-950/20"
                                            >
                                                {isPending && deletingId === reg.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
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
