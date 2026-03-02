import { getAdmins } from '@/app/actions/admin'
import { AdminsManager } from '@/components/admin/admins-manager'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'

export default async function AdminAdminsPage() {
    const cookieStore = await cookies()
    const adminName = cookieStore.get('admin_name')?.value || 'Admin'
    const isSuperAdmin = adminName === 'admin' || adminName === 'System Admin'
    const t = await getTranslations('Admin')
    
    if (!isSuperAdmin) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
                    <p className="text-muted-foreground">You don't have permission to access this page.</p>
                </div>
            </div>
        )
    }
    
    const admins = await getAdmins()

    // Extract data arrays from paginated responses
    const adminsArray = Array.isArray(admins) ? admins : admins.data || []

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admins</h1>
                    <p className="text-muted-foreground">Manage admin accounts</p>
                </div>
            </div>
            <AdminsManager admins={adminsArray} />
        </div>
    )
}
