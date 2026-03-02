'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Home, Users as UsersIcon, BookOpen as BookIcon, FolderOpen, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'
import Link from 'next/link'

interface AdminSidebarProps {
    adminName: string
}

export function AdminSidebar({ adminName }: AdminSidebarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const t = useTranslations('Admin')

    const menuItems = [
        { id: 'overview', label: t('dashboard'), href: '/admin', icon: Home },
        { id: 'registrations', label: 'Registrations', href: '/admin/registrations', icon: UsersIcon },
        { id: 'formations', label: 'Formations', href: '/admin/formations', icon: BookIcon },
        { id: 'categories', label: 'Categories', href: '/admin/categories', icon: FolderOpen },
        { id: 'admins', label: 'Admins', href: '/admin/admins', icon: Settings },
    ]

    const isSuperAdmin = adminName === 'admin' || adminName === 'System Admin'

    return (
        <>
            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
            
            {/* Sidebar */}
            <div className={`
                fixed left-0 top-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 z-50
                transform transition-transform duration-300 ease-in-out
                lg:relative lg:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="lg:hidden"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 p-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            // Skip admins for non-super admins
                            if (item.id === 'admins' && !isSuperAdmin) {
                                return null
                            }
                            
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </div>
        </>
    )
}
