'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createAdmin, updateAdmin } from '@/app/actions/admin'
import { toast } from 'sonner'
import { Plus, Pencil, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Admin {
    id: string
    name: string
    email: string
    created_at: string
}

interface AdminDialogProps {
    mode: 'create' | 'edit'
    admin?: Admin
    onSuccess: () => void
    children?: React.ReactNode
}

export function AdminDialog({ mode, admin, onSuccess, children }: AdminDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState(admin?.name || '')
    const [email, setEmail] = useState(admin?.email || '')
    const [password, setPassword] = useState('')
    const t = useTranslations('Admin.dialog')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (mode === 'create' && !password) {
            toast.error('Password is required for new accounts')
            return
        }

        setIsLoading(true)
        try {
            const result = mode === 'create'
                ? await createAdmin(name, email, password)
                : await updateAdmin(admin!.id, name, email, password)

            if (result.success) {
                toast.success(result.message)
                setOpen(false)
                setPassword('')
                onSuccess()
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error('An error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? children : (
                    mode === 'create' ? (
                        <Button size="sm">
                            <Plus className="me-2 h-4 w-4" />
                            Add Admin
                        </Button>
                    ) : (
                        <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    )
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 text-white border-zinc-800">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{mode === 'create' ? 'Add New Admin' : 'Edit Admin'}</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            {mode === 'create'
                                ? 'Create a new administrator account with a secure password.'
                                : 'Update admin details. Leave password blank to keep current password.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">{t('fullName')}</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-zinc-900 border-zinc-800"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-zinc-900 border-zinc-800"
                                required
                                placeholder="admin@example.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-zinc-900 border-zinc-800"
                                required={mode === 'create'}
                                placeholder={mode === 'edit' ? '•••••••• (leave blank to keep)' : 'Enter secure password'}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <Loader2 className="me-2 h-4 w-4 animate-spin" />
                            ) : null}
                            {mode === 'create' ? 'Create Account' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
