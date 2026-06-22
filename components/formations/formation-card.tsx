'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { ArrowRight, Award } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface FormationCardProps {
    id: string
    title: string
    description: string
    imageSrc: string
    date: string
    price: string
    status?: string
    isCertified?: boolean
}

export function FormationCard({ id, title, description, imageSrc, date, price, status = 'ACTIVE', isCertified }: FormationCardProps) {
    const t = useTranslations('Formations')
    const isActive = status === 'ACTIVE'

    return (
        <Card className="group h-full flex flex-col justify-between overflow-hidden border-0 bg-background/60 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
            <div className="relative aspect-square w-full overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {isCertified && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-lg">
                      <Award className="w-3.5 h-3.5" />
                      Certified
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-bold">{price}</p>
                </div>
            </div>

            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                    <CardDescription className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {date}
                    </CardDescription>
                </div>
                <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {description}
                </p>
            </CardContent>

            <CardFooter className="pt-0">
                <Button
                    asChild
                    size="lg"
                    disabled={!isActive}
                    className={`w-full text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/25 transition-all duration-300 group ${!isActive ? 'cursor-not-allowed opacity-70 hover:shadow-none' : ''}`}
                >
                    <Link
                        href={isActive ? `/formations/${id}/register` : '#'}
                        onClick={(event) => {
                            if (!isActive) {
                                event.preventDefault()
                            }
                        }}
                        aria-disabled={!isActive}
                        tabIndex={isActive ? 0 : -1}
                    >
                        {isActive ? t('register') : 'Registration closed'}
                        {isActive && <ArrowRight className="ms-2 h-5 w-5 transition-transform group-hover:translate-x-1" />}
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
