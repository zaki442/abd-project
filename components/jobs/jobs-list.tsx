'use client'

import { Job } from '@/app/actions/jobs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Briefcase } from 'lucide-react'

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
                <Card key={job.id} className="flex flex-col border border-border/50 bg-card hover:bg-accent/5 transition-colors overflow-hidden group">
                    <CardHeader>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <CardDescription className="text-base line-clamp-3">
                            {job.description}
                        </CardDescription>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white">
                            <Link href={`/jobs/${job.id}/register`}>
                                {t('apply')}
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
