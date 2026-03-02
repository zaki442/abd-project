'use client'

import { useState } from 'react'
import { Sidebar, DynamicStatsCards } from '@/components/admin/responsive-admin-layout'
import { RegistrationsTable } from '@/components/admin/registrations-table'
import { FormationsManager } from '@/components/admin/formations-manager'
import { CategoriesManager } from '@/components/admin/categories-manager'
import { AdminsManager } from '@/components/admin/admins-manager'
import { Button } from '@/components/ui/button'
import { User, Menu } from 'lucide-react'
import { AdminProfileButton } from '@/components/admin/admin-profile-button'
import { LanguageSwitcher } from '@/components/language-switcher'

interface ResponsiveAdminLayoutProps {
    stats: any
    formations: any[]
    registrations: any[]
    categories: any[]
    admins: any[]
    currentAdmin: any
    adminName: string
    isSuperAdmin: boolean
    messages: {
        dashboard: string
        manageRegistrations: string
        welcome: string
        logout: string
    }
}

export function ResponsiveAdminLayout({
    stats,
    formations,
    registrations,
    categories,
    admins,
    currentAdmin,
    adminName,
    isSuperAdmin,
    messages
}: ResponsiveAdminLayoutProps) {
    const [currentPage, setCurrentPage] = useState('overview')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const renderContent = () => {
        switch (currentPage) {
            case 'overview':
                return (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{messages.dashboard}</h1>
                                <p className="text-muted-foreground">{messages.manageRegistrations}</p>
                            </div>
                        </div>
                        <DynamicStatsCards stats={stats} formations={formations} />
                    </div>
                )
            case 'registrations':
                return (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Registrations</h1>
                                <p className="text-muted-foreground">Manage formation registrations</p>
                            </div>
                        </div>
                        <RegistrationsTable 
                            initialRegistrations={registrations} 
                            formations={formations}
                            initialCount={registrations.length}
                            initialPage={1}
                            initialPageSize={10}
                            initialTotalPages={1}
                        />
                    </div>
                )
            case 'formations':
                return (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Formations</h1>
                                <p className="text-muted-foreground">Manage training formations</p>
                            </div>
                        </div>
                        <FormationsManager formations={formations} categories={categories} />
                    </div>
                )
            case 'categories':
                return (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                                <p className="text-muted-foreground">Manage formation categories</p>
                            </div>
                        </div>
                        <CategoriesManager categories={categories} />
                    </div>
                )
            case 'admins':
                return (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Admins</h1>
                                <p className="text-muted-foreground">Manage admin accounts</p>
                            </div>
                        </div>
                        <AdminsManager admins={admins} />
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="flex h-screen">
            <Sidebar 
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                isMobileMenuOpen={isMobileMenuOpen}
                onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                messages={{ dashboard: messages.dashboard }}
            />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mr-2">
                            <User className="h-4 w-4" />
                            <span>{messages.welcome}, <span className="text-white font-medium">{adminName}</span></span>
                        </div>
                        {currentAdmin && <AdminProfileButton admin={currentAdmin as any} />}
                        <form action="/api/logout" method="POST">
                            <Button variant="outline">{messages.logout}</Button>
                        </form>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    )
}
