import { getStatsByFormation, getFormations, testSupabaseConnection } from '@/app/actions/admin'
import { DynamicStatsCards } from '@/components/admin/dynamic-stats-cards'
import { getTranslations } from 'next-intl/server'

export default async function AdminDashboardPage() {
    const t = await getTranslations('Admin')
    
    // Test connection first
    const connectionTest = await testSupabaseConnection()
    console.log('Connection test result:', connectionTest)
    
    const [stats, formations] = await Promise.all([
        getStatsByFormation(),
        getFormations(),
    ])

    // Extract data arrays from paginated responses
    const formationsArray = Array.isArray(formations) ? formations : formations.data || []

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('dashboard')}</h1>
                    <p className="text-muted-foreground">{t('manageRegistrations')}</p>
                </div>
            </div>
            <DynamicStatsCards stats={stats} formations={formationsArray} />
        </div>
    )
}
