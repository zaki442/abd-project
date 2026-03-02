'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, TrendingUp, GraduationCap, Menu, X, Home, Users as UsersIcon, BookOpen as BookIcon, FolderOpen, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Formation {
    id: string
    title: string
}

interface StatsCardsProps {
    stats: {
        total: number
        byFormation: Record<string, number>
    }
    formations: Formation[]
}

interface SidebarProps {
    currentPage: string
    onPageChange: (page: string) => void
    isMobileMenuOpen: boolean
    onMobileMenuToggle: () => void
    messages: {
        dashboard: string
    }
}

function Sidebar({ currentPage, onPageChange, isMobileMenuOpen, onMobileMenuToggle, messages }: SidebarProps) {
    const menuItems = [
        { id: 'overview', label: messages.dashboard, icon: Home },
        { id: 'registrations', label: 'Registrations', icon: UsersIcon },
        { id: 'formations', label: 'Formations', icon: BookIcon },
        { id: 'categories', label: 'Categories', icon: FolderOpen },
        { id: 'admins', label: 'Admins', icon: Settings },
    ]

    return (
        <>
            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onMobileMenuToggle}
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
                            onClick={onMobileMenuToggle}
                            className="lg:hidden"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 p-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <Button
                                    key={item.id}
                                    variant={currentPage === item.id ? 'default' : 'ghost'}
                                    className="w-full justify-start"
                                    onClick={() => {
                                        onPageChange(item.id)
                                        onMobileMenuToggle()
                                    }}
                                >
                                    <Icon className="mr-3 h-4 w-4" />
                                    {item.label}
                                </Button>
                            )
                        })}
                    </nav>
                </div>
            </div>
        </>
    )
}

function DynamicStatsCards({ stats, formations }: StatsCardsProps) {
    const formationEntries = Object.entries(stats.byFormation)
    const t = useTranslations('Admin.stats')
    const ft = useTranslations('Formations.items')

    const getFormationTitle = (id: string) => {
        const formation = formations.find(f => f.id === id)
        if (formation) return formation.title

        // Fallback for hardcoded legacy IDs if needed
        if (id === 'agile-darija') return ft('agile-darija.title')
        if (id === 'mindset') return ft('mindset.title')
        if (id === 'agile-teamwork') return ft('teamwork.title')
        if (id === 'design-thinking') return ft('design-thinking.title')

        return id
    }

    const getMoreColors = (index: number) => {
        const colors = [
            'from-pink-600/20 to-rose-600/20 border-pink-500/30',
            'from-indigo-600/20 to-purple-600/20 border-indigo-500/30',
            'from-teal-600/20 to-cyan-600/20 border-teal-500/30',
            'from-yellow-600/20 to-orange-600/20 border-yellow-500/30',
            'from-red-600/20 to-pink-600/20 border-red-500/30',
        ]
        const textColors = [
            { title: 'text-pink-200', icon: 'text-pink-400', sub: 'text-pink-300' },
            { title: 'text-indigo-200', icon: 'text-indigo-400', sub: 'text-indigo-300' },
            { title: 'text-teal-200', icon: 'text-teal-400', sub: 'text-teal-300' },
            { title: 'text-yellow-200', icon: 'text-yellow-400', sub: 'text-yellow-300' },
            { title: 'text-red-200', icon: 'text-red-400', sub: 'text-red-300' },
        ]
        return { color: colors[index % colors.length], textColor: textColors[index % textColors.length] }
    }

    const baseIcons = [BookOpen, TrendingUp, GraduationCap]
    const extendedIcons = [...baseIcons, Users, Settings, Home]

    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Total Registrations Card */}
            <Card className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 border-violet-500/30 pt-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-violet-200">
                        {t('totalRegistrations')}
                    </CardTitle>
                    <Users className="h-4 w-4 text-violet-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-white">{stats.total}</div>
                    <p className="text-xs text-violet-300 mt-1">
                        {t('allRegistered')}
                    </p>
                </CardContent>
            </Card>

            {/* Dynamic Formation Stats Cards */}
            {formationEntries.map(([formationId, count], index) => {
                const { color, textColor } = getMoreColors(index)
                const Icon = extendedIcons[index % extendedIcons.length]
                const formationName = getFormationTitle(formationId)

                return (
                    <Card key={formationId} className={`bg-gradient-to-br ${color} pt-6`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className={`text-sm font-medium ${textColor.title}`}>
                                {formationName}
                            </CardTitle>
                            <Icon className={`h-4 w-4 ${textColor.icon}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{count}</div>
                            <p className={`text-xs ${textColor.sub} mt-1`}>
                                {t('registrants')}
                            </p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

export { Sidebar, DynamicStatsCards }
