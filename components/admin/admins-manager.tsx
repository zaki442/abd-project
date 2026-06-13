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
import { deleteAdmin } from '@/app/actions/admin'
import { AdminDialog } from './admin-dialog'
import { ConfirmDeleteDialog } from './confirm-delete-dialog'
import { toast } from 'sonner'
import { Trash2, Loader2, ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Admin {
    id: string
    name: string
    email: string
    created_at: string
}

interface AdminsManagerProps {
    admins: Admin[]
}

export function AdminsManager({ admins: initialAdmins }: AdminsManagerProps) {
    const [admins, setAdmins] = useState(initialAdmins)
    const [isPending, startTransition] = useTransition()
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const t = useTranslations('Admin.table')

    const handleDelete = async (id: string, name: string) => {
        setDeletingId(id)
        startTransition(async () => {
            const result = await deleteAdmin(id) as any
            if (result.success) {
                toast.success(result.message)
                if (result.redirected) {
                    window.location.href = '/admin'
                } else {
                    setAdmins((prev) => prev.filter((a) => a.id !== id))
                }
            } else {
                toast.error(result.message)
            }
            setDeletingId(null)
        })
    }

    const handleSuccess = () => {
        window.location.reload()
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Administrators</h2>
                </div>
                <AdminDialog mode="create" onSuccess={handleSuccess} />
            </div>

            <div className="rounded-md border bg-zinc-950 border-zinc-800">
                <Table>
                    <TableHeader className="bg-zinc-900/50">
                        <TableRow className="border-zinc-800 hover:bg-transparent">
                            <TableHead className="text-zinc-400">Name</TableHead>
                            <TableHead className="text-zinc-400">Email</TableHead>
                            <TableHead className="text-zinc-400">Created At</TableHead>
                            <TableHead className="text-end text-zinc-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {admins.length === 0 ? (
                            <TableRow className="border-zinc-800">
                                <TableCell colSpan={3} className="h-24 text-center text-zinc-500">
                                    No administrators found. Use the fallback password to create the first one.
                                </TableCell>
                            </TableRow>
                        ) : (
                            admins.map((admin) => (
                                <TableRow key={admin.id} className="border-zinc-800 hover:bg-zinc-900/40 transition-colors">
                                    <TableCell className="font-medium text-white">{admin.name}</TableCell>
                                    <TableCell className="text-zinc-400">{admin.email}</TableCell>
                                    <TableCell className="text-zinc-400">
                                        {new Date(admin.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-end">
                                        <div className="flex justify-end gap-1">
                                            <AdminDialog
                                                mode="edit"
                                                admin={admin}
                                                onSuccess={handleSuccess}
                                            />
                                            <ConfirmDeleteDialog
                                                onConfirm={() => handleDelete(admin.id, admin.name)}
                                                isPending={isPending && deletingId === admin.id}
                                                title="Delete Admin"
                                                description={`Are you sure you want to delete admin "${admin.name}"?`}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="bg-blue-950/20 border border-blue-900/50 p-4 rounded-lg">
                <p className="text-xs text-blue-300">
                    <strong>Note:</strong> Passwords are encrypted using industry-standard salted hashing (bcrypt).
                    Only registered admins can manage other accounts.
                </p>
            </div>
        </div>
    )
}
