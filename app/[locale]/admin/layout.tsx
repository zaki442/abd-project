import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminProfileButton } from '@/components/admin/admin-profile-button'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import { getCurrentAdmin } from '@/app/actions/admin'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get('admin_authenticated')?.value === 'true'
    const currentAdmin = await getCurrentAdmin()
    const adminName = currentAdmin?.name || cookieStore.get('admin_name')?.value || 'Admin'
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

    return (
        <div className="flex h-screen bg-black">
            <AdminSidebar adminName={adminName} />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                {/* Top Bar */}
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-6 py-4 lg:px-6 pt-16 lg:pt-4">
                    <div className="flex items-center gap-4 flex-wrap">
                        <LanguageSwitcher />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
                            <User className="h-4 w-4" />
                            <span>{t('welcome')}, <span className="text-white font-medium">{adminName}</span></span>
                        </div>
                        {currentAdmin && <AdminProfileButton admin={currentAdmin} />}
                        <form action="/api/logout" method="POST">
                            <Button variant="outline">{t('logout')}</Button>
                        </form>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
