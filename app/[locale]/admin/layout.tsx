import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { AdminLayoutWrapper } from '@/components/admin/admin-layout-wrapper'
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
        <AdminLayoutWrapper adminName={adminName} navbarContent={
            <>
                <LanguageSwitcher />
                <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
                    <User className="h-4 w-4" />
                    <span>{t('welcome')}, <span className="text-white font-medium">{adminName}</span></span>
                </div>
                {currentAdmin && <AdminProfileButton admin={currentAdmin} />}
                <form action="/api/logout" method="POST">
                    <Button variant="outline">{t('logout')}</Button>
                </form>
            </>
        }>
            {children}
        </AdminLayoutWrapper>
    )
}
