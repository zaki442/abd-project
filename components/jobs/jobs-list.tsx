'use client'

import { useState } from 'react'
import { Job } from '@/app/actions/jobs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Briefcase, ChevronDown, ChevronUp } from 'lucide-react'

function JobCard({ job }: { job: Job }) {
    const t = useTranslations('Jobs')
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <Card className="flex flex-col border border-border/50 bg-gradient-to-b from-card to-card/50 hover:-translate-y-1 hover:shadow-xl hover:border-[#5865F2]/50 transition-all duration-300 overflow-hidden group rounded-xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5865F2] to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="pb-4 pt-6">
                <div className="w-12 h-12 rounded-xl bg-[#5865F2]/10 flex items-center justify-center mb-4 text-[#5865F2] group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="w-6 h-6" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">{job.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <CardDescription className={`text-base leading-relaxed text-muted-foreground ${!isExpanded ? 'line-clamp-3' : ''}`}>
                    {job.description}
                </CardDescription>
                {job.description && job.description.length > 120 && (
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-[#5865F2] hover:text-[#4752c4] text-sm font-medium mt-2 flex items-center self-start"
                    >
                        {isExpanded ? (
                            <>{t('showLess')} <ChevronUp className="w-4 h-4 ml-1" /></>
                        ) : (
                            <>{t('showMore')} <ChevronDown className="w-4 h-4 ml-1" /></>
                        )}
                    </button>
                )}
            </CardContent>
            <CardFooter className="pt-4 pb-6 mt-auto">
                <Button asChild className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white shadow-md hover:shadow-lg transition-all duration-300 group-hover:opacity-90">
                    <Link href={`/jobs/${job.id}/register`}>
                        {t('apply')}
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export function JobsList({ jobs }: { jobs: Job[] }) {
    const t = useTranslations('Jobs')

    if (!jobs || jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium text-foreground mb-2">{t('noJobs')}</h3>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    )
}
