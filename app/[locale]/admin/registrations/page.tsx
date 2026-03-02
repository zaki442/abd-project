import { getRegistrations, getFormations } from '@/app/actions/admin'
import { RegistrationsTable } from '@/components/admin/registrations-table'
import { getTranslations } from 'next-intl/server'

export default async function AdminRegistrationsPage() {
    const t = await getTranslations('Admin')
    
    const [registrations, formations] = await Promise.all([
        getRegistrations(),
        getFormations(),
    ])

    // Extract data arrays from paginated responses
    const formationsArray = Array.isArray(formations) ? formations : formations.data || []

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Registrations</h1>
                    <p className="text-muted-foreground">Manage formation registrations</p>
                </div>
            </div>
            <RegistrationsTable 
                initialRegistrations={Array.isArray(registrations) ? registrations : registrations.data || []}
                formations={formationsArray}
                initialCount={typeof registrations === 'object' && registrations.count ? registrations.count : registrations.length}
                initialPage={typeof registrations === 'object' && registrations.page ? registrations.page : 1}
                initialPageSize={typeof registrations === 'object' && registrations.pageSize ? registrations.pageSize : 10}
                initialTotalPages={typeof registrations === 'object' && registrations.totalPages ? registrations.totalPages : 1}
            />
        </div>
    )
}
