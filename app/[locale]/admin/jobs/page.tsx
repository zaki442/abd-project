import { getJobs } from '@/app/actions/jobs'
import { JobsManager } from '@/components/admin/jobs-manager'
import { getTranslations } from 'next-intl/server'

export default async function AdminJobsPage() {
    const t = await getTranslations('Admin.jobs')
    
    // Fetch all jobs, not just active ones
    const jobs = await getJobs(1, 1000, false)

    // Extract data arrays from paginated responses
    const jobsArray = Array.isArray(jobs) ? jobs : jobs.data || []

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                    <p className="text-muted-foreground">{t('description')}</p>
                </div>
            </div>
            <JobsManager jobs={jobsArray} />
        </div>
    )
}
