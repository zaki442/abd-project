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

const FORMATIONS = [
    {
        id: 'agile-darija',
        title: 'Agile B Darija',
        description: 'T3allem lmethode Agile w Scrum b darija maghribiya. Fahm kifach teams kikhdmo b sor3a w efficacité.',
        date: '2 Fevrier 2026',
        price: 'Majjanan',
        imageSrc: '/formations/agile-darija.png',
    },
    {
        id: 'mindset',
        title: 'Mindset & Soft Skills',
        description: 'Twer chakhsiya dyalk w l3aqliya li tnefa3k f hyatk lmihaniya. Communication, leadership, w tadbir lweqt.',
        date: '9 Fevrier 2026',
        price: 'Majjanan',
        imageSrc: '/formations/mindset.png',
    },
    {
        id: 'agile-teamwork',
        title: 'Agile Teamwork',
        description: 'Kifach tkhdem m3a lferqa dyalk b naja7. Workshops w tamarin 3amaliya bach tfehmu dinamyat lferqa.',
        date: '16 Fevrier 2026',
        price: 'Majjanan',
        imageSrc: '/formations/agile-teamwork.png',
    },
    {
        id: 'design-thinking',
        title: 'Design Thinking',
        description: 'Mharet hall lmachakil b tariqa ibda3iya. T3allem kifach tfekker bhal designer bach tlqa hulul mobtakara.',
        date: '23 Fevrier 2026',
        price: 'Majjanan',
        imageSrc: '/formations/design-thinking.png',
    },
]

export function FormationsSlider() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Formations Dyawlna</h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Ikhtar lformation li tnasbek w bda m3ana rhlat tta3alom.
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
                                delay: 4000,
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
