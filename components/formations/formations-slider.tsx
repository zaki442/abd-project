'use client'

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { FormationCard } from './formation-card'
import Autoplay from 'embla-carousel-autoplay'
import { useTranslations } from 'next-intl'

export function FormationsSlider() {
    const t = useTranslations("Formations")

    const FORMATIONS = [
        {
            id: 'agile-darija',
            title: t("items.agile-darija.title"),
            description: t("items.agile-darija.desc"),
            date: t("items.agile-darija.date"),
            price: t("free"),
            imageSrc: '/formations/agile-darija-v2.png',
        },
        {
            id: 'mindset',
            title: t("items.mindset.title"),
            description: t("items.mindset.desc"),
            date: t("items.mindset.date"),
            price: t("free"),
            imageSrc: '/formations/mindset.png',
        },
        {
            id: 'agile-teamwork',
            title: t("items.teamwork.title"),
            description: t("items.teamwork.desc"),
            date: t("items.teamwork.date"),
            price: t("free"),
            imageSrc: '/formations/agile-teamwork.png',
        },
        {
            id: 'design-thinking',
            title: t("items.design-thinking.title"),
            description: t("items.design-thinking.desc"),
            date: t("items.design-thinking.date"),
            price: t("free"),
            imageSrc: '/formations/design-thinking.png',
        },
    ]

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t("title")}</h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        {t("description")}
                    </p>
                </div>

                <div className="flex justify-center px-8 md:px-12">
                    <Carousel
                        opts={{
                            align: 'start',
                            loop: true,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 3000,
                                stopOnInteraction: false,
                            }) as any,
                        ]}
                        className="w-full max-w-6xl"
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {FORMATIONS.map((formation) => (
                                <CarouselItem key={formation.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1 h-full">
                                        <FormationCard {...formation} />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            </div>
        </section>
    )
}
