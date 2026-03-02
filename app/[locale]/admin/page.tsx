import { getFormations, getCategories, getRegistrations, getStatsByFormation, logoutAdmin, getAdmins, getCurrentAdmin } from '@/app/actions/admin'
import { ResponsiveAdminLayout } from '@/components/admin/responsive-admin-layout-client'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { AdminLoginForm } from '@/components/admin/admin-login-form'

export default async function AdminPage() {
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get('admin_authenticated')?.value === 'true'
    const adminName = cookieStore.get('admin_name')?.value || 'Admin'
    const t = await getTranslations('Admin')

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black p-4">
                <div className="w-full max-w-md">
                    <AdminLoginForm />
                </div>
            </div>
        )
    }

    const isSuperAdmin = adminName === 'admin' || adminName === 'System Admin'
    const currentAdmin = await getCurrentAdmin()

    const [registrations, stats, formations, categories, admins] = await Promise.all([
        getRegistrations(),
        getStatsByFormation(),
        getFormations(),
        getCategories(),
        isSuperAdmin ? getAdmins() : Promise.resolve({ data: [], count: 0, page: 1, pageSize: 10, totalPages: 0 }),
    ])

    // Extract data arrays from paginated responses
    const formationsArray = Array.isArray(formations) ? formations : formations.data || []
    const adminsArray = Array.isArray(admins) ? admins : admins.data || []

    return (
        <ResponsiveAdminLayout
            stats={stats}
            formations={formationsArray}
            registrations={Array.isArray(registrations) ? registrations : registrations.data || []}
            categories={categories}
            admins={adminsArray}
            currentAdmin={currentAdmin}
            adminName={adminName}
            isSuperAdmin={isSuperAdmin}
            messages={{
                dashboard: t('dashboard'),
                manageRegistrations: t('manageRegistrations'),
                welcome: t('welcome'),
                logout: t('logout')
            }}
            registrationProps={{
                initialRegistrations: Array.isArray(registrations) ? registrations : registrations.data || [],
                initialCount: typeof registrations === 'object' && registrations.count ? registrations.count : registrations.length,
                initialPage: typeof registrations === 'object' && registrations.page ? registrations.page : 1,
                initialPageSize: typeof registrations === 'object' && registrations.pageSize ? registrations.pageSize : 10,
                initialTotalPages: typeof registrations === 'object' && registrations.totalPages ? registrations.totalPages : 1,
            }}
        />
    )
}
