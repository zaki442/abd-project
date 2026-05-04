'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { createJobRegistration } from '@/app/actions/jobs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface JobRegistrationFormProps {
    jobId: string
    jobTitle: string
}

export function JobRegistrationForm({ jobId, jobTitle }: JobRegistrationFormProps) {
    const t = useTranslations('JobRegistration')
    const router = useRouter()
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const formDataObj = new FormData(e.currentTarget)
            formDataObj.append('job_id', jobId)

            const response = await createJobRegistration(formDataObj)

            if (response.success) {
                alert(t('success'))
                router.push('/jobs')
            } else {
                alert(response.message || 'Error')
            }
        } catch (error) {
            console.error('Submission error', error)
            alert('Error')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                    id="full_name"
                    name="full_name"
                    required
                />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                    id="phone_number"
                    name="phone_number"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="cover_letter">{t('coverLetter')}</Label>
                <Textarea
                    id="cover_letter"
                    name="cover_letter"
                    rows={5}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="cv_file">{t('uploadCv')}</Label>
                <Input
                    id="cv_file"
                    name="cv_file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                />
            </div>

            <Button 
                type="submit" 
                className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white" 
                disabled={isSubmitting}
            >
                {isSubmitting ? t('applying') : t('apply')}
            </Button>
        </form>
    )
}
