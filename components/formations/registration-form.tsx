'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerUser } from '@/app/actions/register'
import { toast } from 'sonner'
import { Loader2, User, Mail, Sparkles, ArrowRight, Phone, Megaphone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'

interface RegistrationFormProps {
    formationId: string
    formationName: string
}

export function RegistrationForm({ formationId, formationName }: RegistrationFormProps) {
    const [isPending, startTransition] = useTransition()
    const t = useTranslations('Registration')
    const router = useRouter()

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        formData.append('formation_id', formationId)

        startTransition(async () => {
            const result = await registerUser(null, formData)

            if (result.success) {
                toast.success(result.message)
                router.push('/formations')
            } else {
                toast.error(result.message)
            }
        })
    }

    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none rounded-xl" />
            <div className="space-y-3 relative mb-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-center">
                    {t('title')} <span className="text-primary">{formationName}</span>
                </h1>
                <p className="text-center text-muted-foreground text-sm">
                    {t('desc')}
                </p>
            </div>
            <form onSubmit={onSubmit} className="grid gap-6 relative">
                <div className="space-y-2">
                    <Label htmlFor="full_name">{t('fullName')}</Label>
                    <div className="relative">
                        <User className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="full_name"
                            name="full_name"
                            placeholder="Zaki AD"
                            className="ps-10"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <div className="relative">
                        <Mail className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="zaki@example.com"
                            className="ps-10"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone_number">{t('phoneNumber')}</Label>
                    <div className="relative">
                        <Phone className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="phone_number"
                            name="phone_number"
                            type="tel"
                            placeholder="+212 600 000 000"
                            className="ps-10"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="where_did_you_hear">{t('whereDidYouHear')}</Label>
                    <div className="relative">
                        <Megaphone className="absolute start-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <select
                            id="where_did_you_hear"
                            name="where_did_you_hear"
                            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 ps-10 pe-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="">{t('selectOption')}</option>
                            <option value="linkedin">{t('linkedin')}</option>
                            <option value="facebook">{t('facebook')}</option>
                            <option value="instagram">{t('instagram')}</option>
                            <option value="tiktok">{t('tiktok')}</option>
                        </select>
                    </div>
                </div>
                <Button
                    type="submit"
                    disabled={isPending}
                    size="lg"
                    className="w-full font-bold py-6 text-lg"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="me-2 h-5 w-5 animate-spin" />
                            {t('registering')}
                        </>
                    ) : (
                        <>
                            {t('sendInfo')}
                            <ArrowRight className="ms-2 h-5 w-5" />
                        </>
                    )}
                </Button>
            </form>
        </div>
    )
}
