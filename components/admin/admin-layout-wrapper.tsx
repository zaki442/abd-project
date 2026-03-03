'use client'

import { useState } from 'react'
import { AdminSidebar } from './admin-sidebar'
import { AdminNavbar } from './admin-navbar'

interface AdminLayoutWrapperProps {
    adminName: string
    children: React.ReactNode
    navbarContent: React.ReactNode
}

export function AdminLayoutWrapper({ adminName, children, navbarContent }: AdminLayoutWrapperProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="flex h-screen bg-black">
            <AdminSidebar adminName={adminName} isMobileMenuOpen={isMobileMenuOpen} onMobileMenuToggle={setIsMobileMenuOpen} />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                <AdminNavbar 
                    onMobileMenuToggle={setIsMobileMenuOpen}
                    isMobileMenuOpen={isMobileMenuOpen}
                >
                    {navbarContent}
                </AdminNavbar>

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
