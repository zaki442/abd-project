import { getRegistrations, getStatsByFormation, logoutAdmin } from '@/app/actions/admin'
import { RegistrationsTable } from '@/components/admin/registrations-table'
import { StatsCards } from '@/components/admin/stats-cards'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'

import { AdminLoginForm } from '../../components/admin/admin-login-form'

export default async function AdminPage() {
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get('admin_authenticated')?.value === 'true'
    const adminName = cookieStore.get('admin_name')?.value || 'Admin'

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black p-4">
                <div className="w-full max-w-md">
                    <AdminLoginForm />
                </div>
            </div>
        )
    }

    const [registrations, stats] = await Promise.all([
        getRegistrations(),
        getStatsByFormation(),
    ])

    return (
        <div className="min-h-screen bg-black p-8 text-white">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage formation registrations.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>Mrhba, <span className="text-white font-medium">{adminName}</span></span>
                        </div>
                        <form action={async () => {
                            'use server'
                            await logoutAdmin()
                            redirect('/admin')
                        }}>
                            <Button variant="outline">Logout</Button>
                        </form>
                    </div>
                </div>

                <StatsCards stats={stats} />

                <RegistrationsTable initialRegistrations={registrations} />
            </div>
        </div>
    )
}
