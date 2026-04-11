import { getStatsByFormation, getFormations, testSupabaseConnection } from '@/app/actions/admin'
import { getJobs, getJobRegistrations } from '@/app/actions/jobs'
import { DynamicStatsCards } from '@/components/admin/dynamic-stats-cards'
import { JobsManager } from '@/components/admin/jobs-manager'
import { JobRegistrationsManager } from '@/components/admin/job-registrations-manager'
import { getTranslations } from 'next-intl/server'

export default async function AdminDashboardPage() {
    const t = await getTranslations('Admin')
    
    // Test connection first
    const connectionTest = await testSupabaseConnection()
    console.log('Connection test result:', connectionTest)
    
    const [stats, formations, jobs, jobRegistrations] = await Promise.all([
        getStatsByFormation(),
        getFormations(),
        getJobs(1, 1000, false),
        getJobRegistrations(1, 1000)
    ])

    // Extract data arrays from paginated responses
    const formationsArray = Array.isArray(formations) ? formations : formations.data || []
    const jobsArray = Array.isArray(jobs) ? jobs : jobs.data || []
    const jobRegsArray = Array.isArray(jobRegistrations) ? jobRegistrations : jobRegistrations.data || []

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('dashboard')}</h1>
                    <p className="text-muted-foreground">{t('manageRegistrations')}</p>
                </div>
            </div>
            
            <DynamicStatsCards stats={stats} formations={formationsArray} />

            <div className="mt-12 space-y-12">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Manage Jobs</h2>
                    <JobsManager jobs={jobsArray} />
                </div>
                
                <div className="pt-8 border-t border-zinc-800">
                    <h2 className="text-2xl font-bold mb-4">Job Applications</h2>
                    <JobRegistrationsManager registrations={jobRegsArray} />
                </div>
            </div>
        </div>
    )
}
