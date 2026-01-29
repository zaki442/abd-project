'use client'

import { useState, useTransition } from 'react'
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
import { createRegistration, updateRegistration } from '@/app/actions/admin'
import { toast } from 'sonner'
import { Plus, Pencil, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Registration {
    id: string
    created_at: string
    full_name: string
    email: string
    formation_id: string
}

interface RegistrationDialogProps {
    mode: 'create' | 'edit'
    registration?: Registration
    onSuccess?: (data: Registration) => void
}

export function RegistrationDialog({ mode, registration, onSuccess }: RegistrationDialogProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const t = useTranslations('Admin.dialog')
    const ft = useTranslations('Formations.items')

    const FORMATIONS = [
        { id: 'agile-darija', name: ft('agile-darija.title') },
        { id: 'mindset', name: ft('mindset.title') },
        { id: 'agile-teamwork', name: ft('teamwork.title') },
        { id: 'design-thinking', name: ft('design-thinking.title') },
    ]

    const [formData, setFormData] = useState({
        full_name: registration?.full_name || '',
        email: registration?.email || '',
        formation_id: registration?.formation_id || FORMATIONS[0].id,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        startTransition(async () => {
            if (mode === 'create') {
                const result = await createRegistration(formData)
                if (result.success) {
                    toast.success(result.message)
                    setOpen(false)
                    setFormData({ full_name: '', email: '', formation_id: FORMATIONS[0].id })
                    onSuccess?.({ id: '', created_at: new Date().toISOString(), ...formData })
                } else {
                    toast.error(result.message)
                }
            } else if (registration) {
                const result = await updateRegistration(registration.id, formData)
                if (result.success) {
                    toast.success(result.message)
                    setOpen(false)
                    onSuccess?.({ ...registration, ...formData })
                } else {
                    toast.error(result.message)
                }
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {mode === 'create' ? (
                    <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        {t('addRegistration')}
                    </Button>
                ) : (
                    <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-950/20">
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {mode === 'create' ? t('addNew') : t('edit')}
                        </DialogTitle>
                        <DialogDescription>
                            {mode === 'create'
                                ? t('enterInfo')
                                : t('modifyInfo')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="full_name">{t('fullName')}</Label>
                            <Input
                                id="full_name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="Zaki Ad"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="email@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="formation">{t('formation')}</Label>
                            <select
                                id="formation"
                                value={formData.formation_id}
                                onChange={(e) => setFormData({ ...formData, formation_id: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                {FORMATIONS.map((f) => (
                                    <option key={f.id} value={f.id}>
                                        {f.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                                    {t('saving')}
                                </>
                            ) : mode === 'create' ? (
                                t('add')
                            ) : (
                                t('save')
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
