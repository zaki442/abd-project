import { getJob } from '@/app/actions/jobs'
import { JobRegistrationForm } from '@/components/jobs/job-registration-form'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function JobRegistrationPage({ params }: { params: Promise<{ locale: string, jobId: string }> }) {
    const { jobId } = await params
    
    // Fetch job details
    const job = await getJob(jobId)
    
    if (!job || !job.is_active) {
        notFound()
    }
    
    const t = await getTranslations('JobRegistration')

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            
            <div className="pt-32 pb-16">
                <div className="container max-w-2xl mx-auto px-4">
                    <Link 
                        href="/jobs" 
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('backToJobs')}
                    </Link>

                    <div className="space-y-6 mb-8">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {t('title')} <span className="text-[#5865F2]">{job.title}</span>
                            </h1>
                            <p className="text-muted-foreground">
                                {t('desc')}
                            </p>
                        </div>

                        {job.description && (
                            <div className="bg-muted/30 p-5 rounded-xl border border-border/50">
                                <p className="text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                    {job.description}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="bg-card border border-border/50 rounded-lg p-6 md:p-8 shadow-sm">
                        <JobRegistrationForm jobId={job.id} jobTitle={job.title} />
                    </div>
                </div>
            </div>
            
            <Footer />
        </main>
    )
}
