import { getJobRegistrations } from '@/app/actions/jobs'
import { JobRegistrationsManager } from '@/components/admin/job-registrations-manager'
import { getTranslations } from 'next-intl/server'

export default async function AdminJobRegistrationsPage() {
    const t = await getTranslations('Admin.jobRegistrations')
    
    // Fetch applications
    const registrations = await getJobRegistrations(1, 1000)

    // Extract data arrays from paginated responses
    const regsArray = Array.isArray(registrations) ? registrations : registrations.data || []

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                    <p className="text-muted-foreground">Manage people applying for jobs</p>
                </div>
            </div>
            <JobRegistrationsManager registrations={regsArray} />
        </div>
    )
}
