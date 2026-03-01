import { getFormations, getCategories, getRegistrations, getStatsByFormation, logoutAdmin, getAdmins, getCurrentAdmin } from '@/app/actions/admin'
import { RegistrationsTable } from '@/components/admin/registrations-table'
import { StatsCards } from '@/components/admin/stats-cards'
import { FormationsManager } from '@/components/admin/formations-manager'
import { CategoriesManager } from '@/components/admin/categories-manager'
import { AdminsManager } from '@/components/admin/admins-manager'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import { AdminProfileButton } from '@/components/admin/admin-profile-button'
import { getTranslations } from 'next-intl/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'

import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { LanguageSwitcher } from '@/components/language-switcher'

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
        isSuperAdmin ? getAdmins() : Promise.resolve({ data: [], count: 0, page: 1, pageSize: 50, totalPages: 0 }),
    ])

    // Extract data arrays from paginated responses
    const formationsArray = Array.isArray(formations) ? formations : formations.data || []
    const adminsArray = Array.isArray(admins) ? admins : admins.data || []

    return (
        <div className="min-h-screen bg-black p-8 text-white">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard')}</h1>
                        <p className="text-muted-foreground">{t('manageRegistrations')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
                            <User className="h-4 w-4" />
                            <span>{t('welcome')}, <span className="text-white font-medium">{adminName}</span></span>
                        </div>
                        {currentAdmin && <AdminProfileButton admin={currentAdmin as any} />}
                        <form action={async () => {
                            'use server'
                            await logoutAdmin()
                            redirect('/admin')
                        }}>
                            <Button variant="outline">{t('logout')}</Button>
                        </form>
                    </div>
                </div>

                <StatsCards stats={stats} formations={formationsArray} />

                <Tabs defaultValue="registrations" className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <TabsList className="bg-zinc-900 border border-zinc-800">
                            <TabsTrigger value="registrations">Registrations</TabsTrigger>
                            <TabsTrigger value="formations">Formations</TabsTrigger>
                            <TabsTrigger value="categories">Categories</TabsTrigger>
                            {isSuperAdmin && <TabsTrigger value="admins">Admins</TabsTrigger>}
                        </TabsList>
                    </div>

                    <TabsContent value="registrations" className="space-y-4">
                        <RegistrationsTable initialRegistrations={Array.isArray(registrations) ? registrations : registrations.data || []} formations={formationsArray} />
                    </TabsContent>

                    <TabsContent value="formations" className="space-y-4">
                        <FormationsManager formations={formationsArray} categories={categories} />
                    </TabsContent>

                    <TabsContent value="categories" className="space-y-4">
                        <CategoriesManager categories={categories} />
                    </TabsContent>

                    {isSuperAdmin && (
                        <TabsContent value="admins" className="space-y-4">
                            <AdminsManager admins={adminsArray} />
                        </TabsContent>
                    )}
                </Tabs>
            </div>
        </div>
    )
}
