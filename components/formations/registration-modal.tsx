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
import { Loader2, User, Mail, Sparkles, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

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
                <Button
                    size="lg"
                    className="w-full text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/25 transition-all duration-300 group"
                >
                    {triggerText}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-zinc-800 bg-zinc-950/90 backdrop-blur-xl text-white shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none rounded-lg" />
                <DialogHeader className="space-y-3 relative">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-center">
                        Tasjil f <span className="text-primary">{formationName}</span>
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-400 text-base">
                        7ett lma3lumat dyalk bach ntaslo bik w nkmmlu tasjil.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="grid gap-6 py-4 relative">
                    <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-zinc-300">
                            Smiya lkamila
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                            <Input
                                id="full_name"
                                name="full_name"
                                placeholder="Zaki Abid"
                                className="pl-10 bg-zinc-900/50 border-zinc-700 focus:border-primary focus:ring-primary/20 transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-zinc-300">
                            Email
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="zaki@example.com"
                                className="pl-10 bg-zinc-900/50 border-zinc-700 focus:border-primary focus:ring-primary/20 transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg shadow-lg hover:shadow-primary/25 transition-all duration-300"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Kitsajjal...
                                </>
                            ) : (
                                <>
                                    Sifet lma3lumat
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
