'use client'

import { useState, useTransition } from 'react'
import { verifyAdminLogin } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Lock, Loader2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export function AdminLoginForm() {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const t = useTranslations('Admin.login')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        startTransition(async () => {
            const result = await verifyAdminLogin(name, password)
            if (result.success) {
                router.refresh() // Refresh to hit the server component again and pass the cookie check
            } else {
                setError(result.message || 'Error occurred')
            }
        })
    }

    return (
        <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
            <CardHeader className="space-y-1">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lock className="h-6 w-6 text-primary" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center text-white">{t('access')}</CardTitle>
                <CardDescription className="text-center text-zinc-400">
                    {t('enterPassword')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="text"
                            placeholder={t('nameLabel')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Input
                            type="password"
                            placeholder={t('passwordLabel')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-500"
                        />
                    </div>
                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-950/20 p-3 rounded-md">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending || !name || !password}
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t('loginButton')}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
