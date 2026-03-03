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
import { deleteRegistration, getRegistrations } from '@/app/actions/admin'
import { RegistrationDialog } from './registration-dialog'
import { toast } from 'sonner'
import { Trash2, Search, Loader2, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

const WHERE_DID_YOU_HEAR_MAP: Record<string, string> = {
    linkedin: 'linkedin',
    facebook: 'facebook',
    instagram: 'instagram',
    tiktok: 'tiktok',
}

interface Registration {
    id: string
    created_at: string
    full_name: string
    email: string
    phone_number?: string
    where_did_you_hear?: string
    formation_id: string
}

interface Formation {
    id: string
    title: string
    date: string
}

interface RegistrationsTableProps {
    initialRegistrations: Registration[]
    formations: Formation[]
    initialCount?: number
    initialPage?: number
    initialPageSize?: number
    initialTotalPages?: number
}

export function RegistrationsTable({ 
    initialRegistrations, 
    formations, 
    initialCount = 0,
    initialPage = 1,
    initialPageSize = 10,
    initialTotalPages = 0
}: RegistrationsTableProps) {
    const [registrations, setRegistrations] = useState(initialRegistrations)
    const [searchQuery, setSearchQuery] = useState('')
    const [isPending, startTransition] = useTransition()
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [pageSize, setPageSize] = useState(initialPageSize)
    const [totalCount, setTotalCount] = useState(initialCount)
    const [totalPages, setTotalPages] = useState(initialTotalPages)
    const [isLoading, setIsLoading] = useState(false)
    const t = useTranslations('Admin.table')
    const tDialog = useTranslations('Admin.dialog')
    const ft = useTranslations('Formations.items')

    const getWhereDidYouHearLabel = (value: string | undefined) => {
        if (!value) return '—'
        const key = WHERE_DID_YOU_HEAR_MAP[value]
        return key ? tDialog(key) : value
    }

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

    const getFormationDate = (id: string) => {
        const formation = formations.find(f => f.id === id)
        if (formation && formation.date) {
            return new Date(formation.date).toLocaleDateString()
        }
        return '—'
    }

    const fetchPage = async (page: number, size: number) => {
        setIsLoading(true)
        try {
            const result = await getRegistrations(page, size)
            setRegistrations(result.data)
            setTotalCount(result.count)
            setTotalPages(result.totalPages)
            setCurrentPage(page)
            setPageSize(size)
        } catch (error) {
            console.error('Error fetching page:', error)
            toast.error('Failed to load registrations')
        } finally {
            setIsLoading(false)
        }
    }

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && !isLoading) {
            fetchPage(page, pageSize)
        }
    }

    const handlePageSizeChange = (newSize: number) => {
        fetchPage(1, newSize)
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

    // For pagination display, use the actual registrations count, not filtered count
    const displayCount = searchQuery ? filteredRegistrations.length : registrations.length

    const handleDelete = async (id: string) => {
        if (!confirm(t('confirmDelete'))) return

        setDeletingId(id)
        startTransition(async () => {
            const result = await deleteRegistration(id)
            if (result.success) {
                toast.success(result.message)
                // Refresh current page to maintain data consistency
                await fetchPage(currentPage, pageSize)
            } else {
                toast.error(result.message)
            }
            setDeletingId(null)
        })
    }

    const handleCreateSuccess = () => {
        // Refresh first page to show new registration
        fetchPage(1, pageSize)
    }

    const handleEditSuccess = (updated: Registration) => {
        setRegistrations((prev) =>
            prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
        )
    }

    const exportToCSV = () => {
        const dataToExport = searchQuery ? filteredRegistrations : registrations
        const headers = [`ID,${t('date')},${t('fullName')},${t('email')},${t('phoneNumber')},${t('whereDidYouHear')},${t('formation')},Formation Date`]
        const rows = dataToExport.map(reg => {
            const formationName = getFormationTitle(reg.formation_id).replace(/"/g, '""')
            const formationDate = getFormationDate(reg.formation_id)
            return `${reg.id},${reg.created_at},"${reg.full_name}",${reg.email},${reg.phone_number || ''},"${(reg.where_did_you_hear || '').replace(/"/g, '""')}", "${formationName}",${formationDate}`
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

    const PaginationControls = () => {
        const pages = []
        const maxVisiblePages = 5
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }

        return (
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>Page {currentPage} of {totalPages}</span>
                    <span>({totalCount} total)</span>
                </div>
                
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1 || isLoading}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        
                        {startPage > 1 && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(1)}
                                    disabled={isLoading}
                                >
                                    1
                                </Button>
                                {startPage > 2 && <span className="px-2">...</span>}
                            </>
                        )}
                        
                        {pages.map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                disabled={isLoading}
                            >
                                {page}
                            </Button>
                        ))}
                        
                        {endPage < totalPages && (
                            <>
                                {endPage < totalPages - 1 && <span className="px-2">...</span>}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={isLoading}
                                >
                                    {totalPages}
                                </Button>
                            </>
                        )}
                        
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages || isLoading}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    
                    <select
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        className="h-8 w-16 rounded border border-input bg-background px-2 text-sm"
                        disabled={isLoading}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>
        )
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
                        {t('showing')}: {displayCount} {t('of')} {totalCount}
                    </div>
                    <Button variant="outline" size="sm" onClick={exportToCSV}>
                        <Download className="me-2 h-4 w-4" />
                        {t('exportCSV')}
                    </Button>
                    <RegistrationDialog mode="create" formations={formations} onSuccess={handleCreateSuccess} />
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
                            <TableHead>{t('whereDidYouHear')}</TableHead>
                            <TableHead>{t('formation')}</TableHead>
                            <TableHead>Formation Date</TableHead>
                            <TableHead className="text-end">{t('actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Loading...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : searchQuery && filteredRegistrations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    {t('noResults')}
                                </TableCell>
                            </TableRow>
                        ) : registrations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    No registrations found
                                </TableCell>
                            </TableRow>
                        ) : (
                            (searchQuery ? filteredRegistrations : registrations).map((reg) => (
                                <TableRow key={reg.id}>
                                    <TableCell className="font-medium">
                                        {new Date(reg.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{reg.full_name}</TableCell>
                                    <TableCell>{reg.email}</TableCell>
                                    <TableCell>{reg.phone_number || '-'}</TableCell>
                                    <TableCell>{getWhereDidYouHearLabel(reg.where_did_you_hear)}</TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                            {getFormationTitle(reg.formation_id)}
                                        </span>
                                    </TableCell>
                                    <TableCell>{getFormationDate(reg.formation_id)}</TableCell>
                                    <TableCell className="text-end">
                                        <div className="flex justify-end gap-1">
                                            <RegistrationDialog
                                                mode="edit"
                                                registration={reg}
                                                formations={formations}
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
            
            {totalPages > 1 && (
                <div className="flex items-center justify-center">
                    <PaginationControls />
                </div>
            )}
        </div>
    )
}
