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
    const registrationsArray = Array.isArray(registrations) ? registrations : registrations.data || []
    const isArray = Array.isArray(registrations)

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Registrations</h1>
                    <p className="text-muted-foreground">Manage formation registrations</p>
                </div>
            </div>
            <RegistrationsTable 
                initialRegistrations={registrationsArray}
                formations={formationsArray}
                initialCount={isArray ? registrations.length : (registrations.count ?? registrations.data?.length ?? 0)}
                initialPage={isArray ? 1 : (registrations.page ?? 1)}
                initialPageSize={isArray ? registrations.length : (registrations.pageSize ?? registrations.data?.length ?? 10)}
                initialTotalPages={
                    isArray
                        ? 1
                        : (registrations.totalPages ??
                           Math.ceil((registrations.count ?? registrations.data?.length ?? 0) /
                                     (registrations.pageSize ?? 1)))
                }
            />
        </div>
    )
}
