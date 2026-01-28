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
import { toast } from 'sonner'
import { Trash2, Search, Loader2, Download } from 'lucide-react'

// If date-fns is not available, I'll fallback to native.
// I'll assume native for now to be safe.

interface Registration {
    id: string
    created_at: string
    full_name: string
    email: string
    formation_id: string
}

interface RegistrationsTableProps {
    initialRegistrations: Registration[]
}

export function RegistrationsTable({ initialRegistrations }: RegistrationsTableProps) {
    const [registrations, setRegistrations] = useState(initialRegistrations)
    const [searchQuery, setSearchQuery] = useState('')
    const [isPending, startTransition] = useTransition()
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const filteredRegistrations = registrations.filter((reg) =>
        reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.formation_id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        if (!confirm('Wash mt2ked baghi tms7 had l user?')) return

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

    const exportToCSV = () => {
        const headers = ['ID,Date,Full Name,Email,Formation ID']
        const rows = filteredRegistrations.map(reg =>
            `${reg.id},${reg.created_at},"${reg.full_name}",${reg.email},${reg.formation_id}`
        )
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
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    Total: {filteredRegistrations.length}
                </div>
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            <div className="rounded-md border bg-zinc-950">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Date</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Formation</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRegistrations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No results.
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
                                    <TableCell>{reg.formation_id}</TableCell>
                                    <TableCell className="text-right">
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
