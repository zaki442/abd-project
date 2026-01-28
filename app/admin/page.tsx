import { getRegistrations, verifyAdminPassword, logoutAdmin } from '@/app/actions/admin' // verify/logout handled in client component usually for interactivity but here I need server check
import { RegistrationsTable } from '@/components/admin/registrations-table'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock } from 'lucide-react'

import { AdminLoginForm } from '../../components/admin/admin-login-form'

// Login component to stay in the same file for simplicity since it's a small app
// Actually I need a client component for the login form to handle state/interactivity.
// I'll make a separate client component for login.

export default async function AdminPage() {
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get('admin_authenticated')?.value === 'true'

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black p-4">
                <div className="w-full max-w-md">
                    {/* I'll import a client side login form here */}
                    <AdminLoginForm />
                </div>
            </div>
        )
    }

    const registrations = await getRegistrations()

    return (
        <div className="min-h-screen bg-black p-8 text-white">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage formation registrations.</p>
                    </div>
                    <form action={async () => {
                        'use server'
                        await logoutAdmin()
                        redirect('/admin')
                    }}>
                        <Button variant="outline">Logout</Button>
                    </form>
                </div>

                <RegistrationsTable initialRegistrations={registrations} />
            </div>
        </div>
    )
}

// Client component for Login

