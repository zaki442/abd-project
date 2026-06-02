'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { submitFeedback } from '@/app/actions/feedbacks'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function FeedbackForm() {
    const t = useTranslations('Feedback')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)
        const data = {
            full_name: formData.get('fullName') as string,
            email: formData.get('email') as string,
            role: formData.get('role') as string,
            feedback: formData.get('feedback') as string,
        }

        const result = await submitFeedback(data)

        setIsLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(t('success'))
            setIsSubmitted(true)
        }
    }

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-900 rounded-xl border border-zinc-800">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('success')}</h3>
                <p className="text-gray-400">
                    We appreciate your input to help us improve the community.
                </p>
                <Button 
                    variant="outline" 
                    className="mt-6 border-zinc-700 hover:bg-zinc-800 text-white"
                    onClick={() => setIsSubmitted(false)}
                >
                    Submit another response
                </Button>
            </div>
        )
    }

    return (
        <div className="bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-6 sm:p-10 max-w-xl mx-auto w-full shadow-2xl shadow-black/40 relative overflow-hidden">
            {/* Subtle top glow */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-500/50 to-transparent"></div>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">{t('title')}</h2>
                <p className="text-gray-400">{t('description')}</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white">{t('fullName')} <span className="text-red-500">*</span></Label>
                    <Input
                        id="fullName"
                        name="fullName"
                        required
                        className="bg-zinc-950 border-zinc-800 text-white"
                        placeholder="e.g. John Doe"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">{t('email') || 'Email'} <span className="text-red-500">*</span></Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="bg-zinc-950 border-zinc-800 text-white"
                        placeholder="e.g. john@example.com"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role" className="text-white">{t('role')}</Label>
                    <Input
                        id="role"
                        name="role"
                        className="bg-zinc-950 border-zinc-800 text-white"
                        placeholder="e.g. Software Engineer, Scrum Master"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="feedback" className="text-white">{t('feedback')} <span className="text-red-500">*</span></Label>
                    <Textarea
                        id="feedback"
                        name="feedback"
                        required
                        rows={5}
                        className="bg-zinc-950 border-zinc-800 text-white resize-none"
                        placeholder="Share your thoughts, suggestions, or experience..."
                    />
                </div>

                <Button 
                    type="submit" 
                    className="w-full bg-white text-black hover:bg-gray-200"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('submitting')}
                        </>
                    ) : (
                        t('submit')
                    )}
                </Button>
            </form>
        </div>
    )
}
