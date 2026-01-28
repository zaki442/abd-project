'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, TrendingUp, GraduationCap } from 'lucide-react'

// Formation names mapping for display
const FORMATION_NAMES: Record<string, string> = {
    'agile-darija': 'Agile B Darija',
    'mindset': 'Mindset & Soft Skills',
    'agile-teamwork': 'Agile Teamwork',
    'design-thinking': 'Design Thinking',
}

interface StatsCardsProps {
    stats: {
        total: number
        byFormation: Record<string, number>
    }
}

export function StatsCards({ stats }: StatsCardsProps) {
    const formationEntries = Object.entries(stats.byFormation)

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Registrations Card */}
            <Card className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 border-violet-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-violet-200">
                        Total Registrations
                    </CardTitle>
                    <Users className="h-4 w-4 text-violet-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-white">{stats.total}</div>
                    <p className="text-xs text-violet-300 mt-1">
                        Ga3 lmosjlin
                    </p>
                </CardContent>
            </Card>

            {/* Formation Stats Cards */}
            {formationEntries.slice(0, 3).map(([formationId, count], index) => {
                const icons = [BookOpen, TrendingUp, GraduationCap]
                const colors = [
                    'from-blue-600/20 to-cyan-600/20 border-blue-500/30',
                    'from-green-600/20 to-emerald-600/20 border-green-500/30',
                    'from-orange-600/20 to-amber-600/20 border-orange-500/30',
                ]
                const textColors = [
                    { title: 'text-blue-200', icon: 'text-blue-400', sub: 'text-blue-300' },
                    { title: 'text-green-200', icon: 'text-green-400', sub: 'text-green-300' },
                    { title: 'text-orange-200', icon: 'text-orange-400', sub: 'text-orange-300' },
                ]
                const Icon = icons[index % icons.length]

                return (
                    <Card key={formationId} className={`bg-gradient-to-br ${colors[index % colors.length]}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className={`text-sm font-medium ${textColors[index % textColors.length].title}`}>
                                {FORMATION_NAMES[formationId] || formationId}
                            </CardTitle>
                            <Icon className={`h-4 w-4 ${textColors[index % textColors.length].icon}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{count}</div>
                            <p className={`text-xs ${textColors[index % textColors.length].sub} mt-1`}>
                                mosjlin
                            </p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
