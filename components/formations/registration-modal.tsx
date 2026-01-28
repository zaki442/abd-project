'use client'

import { useState, useTransition } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerUser } from '@/app/actions/register'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface RegistrationModalProps {
    formationId: string
    formationName: string
    triggerText?: string
}

export function RegistrationModal({
    formationId,
    formationName,
    triggerText = "S'inscrire",
}: RegistrationModalProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        formData.append('formation_id', formationId)

        startTransition(async () => {
            const result = await registerUser(null, formData)

            if (result.success) {
                toast.success(result.message)
                setOpen(false)
            } else {
                toast.error(result.message)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full text-lg">
                    {triggerText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tasjil f {formationName}</DialogTitle>
                    <DialogDescription>
                        7ett lma3lumat dyalk bach ntaslo bik w nkmmlu tasjil.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="full_name" className="text-right">
                            Smiya lkamila
                        </Label>
                        <Input
                            id="full_name"
                            name="full_name"
                            placeholder="Zaki Abidi"
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="zaki@example.com"
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isPending ? 'Kitsajjal...' : 'Sifet'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
