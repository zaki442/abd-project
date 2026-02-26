'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerUser } from '@/app/actions/register'
import { toast } from 'sonner'
import { Loader2, User, Mail, ArrowRight, Phone, Megaphone, Calendar, Tag, ChevronLeft, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import Image from 'next/image'
import { Link } from '@/i18n/routing'

interface RegistrationFormProps {
    formationId: string
    formationName: string
    formationDescription: string
    formationDate?: string
    formationPrice?: string
    formationImageUrl?: string
}

export function RegistrationForm({
    formationId,
    formationName,
    formationDescription,
    formationDate,
    formationPrice,
    formationImageUrl,
}: RegistrationFormProps) {
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
        <div className="container mx-auto px-4 md:px-6">
            {/* Back link */}
            <div className="mb-8">
                <Link
                    href="/formations"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    {t('backToFormations')}
                </Link>
            </div>

            {/* Two-column layout: formation highlight + form */}
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-0 max-w-5xl mx-auto rounded-2xl overflow-hidden border border-border bg-card shadow-xl">
                {/* Left: Formation summary */}
                <div className="relative min-h-[220px] lg:min-h-[560px] bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6 lg:p-10 flex flex-col justify-between">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)] pointer-events-none" />
                    <div className="relative space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                            {t('registeringFor')}
                        </div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                            {formationName}
                        </h1>
                        {(formationDate || formationPrice) && (
                            <div className="flex flex-wrap gap-4 text-muted-foreground">
                                {formationDate && (
                                    <span className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {formationDate}
                                    </span>
                                )}
                                {formationPrice && (
                                    <span className="flex items-center gap-2">
                                        <Tag className="h-4 w-4" />
                                        {formationPrice}
                                    </span>
                                )}
                            </div>
                        )}
                        <p className="text-sm text-foreground/80 leading-relaxed italic border-l-2 border-primary/30 pl-4 py-1">
                            {formationDescription}
                        </p>
                    </div>
                    {formationImageUrl && (
                        <div className="relative mt-6 lg:mt-0 aspect-square rounded-2xl overflow-hidden border border-border/50 shadow-lg shadow-primary/5">
                            <Image
                                src={formationImageUrl}
                                alt={formationName}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    )}
                </div>

                {/* Right: Form */}
                <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                    <p className="text-muted-foreground text-sm mb-6">
                        {t('desc')}
                    </p>
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="full_name" className="text-sm font-medium">
                                {t('fullName')}
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    placeholder="John Doe"
                                    className="pl-10 h-11"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                {t('email')}
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    className="pl-10 h-11"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone_number" className="text-sm font-medium">
                                {t('phoneNumber')}
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone_number"
                                    name="phone_number"
                                    type="tel"
                                    placeholder="+212 600 000 000"
                                    className="pl-10 h-11"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="where_did_you_hear" className="text-sm font-medium">
                                {t('whereDidYouHear')}
                            </Label>
                            <div className="relative">
                                <Megaphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <select
                                    id="where_did_you_hear"
                                    name="where_did_you_hear"
                                    className="flex h-11 w-full rounded-md border border-input bg-background pl-10 pr-9 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer"
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
                            className="w-full mt-6 h-12 text-base font-semibold"
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
                        <p className="text-xs text-muted-foreground text-center pt-2">
                            {t('weWillContact')}
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
