'use client'

import { useState } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Category = {
    id: string
    name: string
}

type Formation = {
    id: string
    title: string
    description: string
    date: string
    price: string
    image_url: string
    category_id: string
}

interface FormationsSliderProps {
    formations?: Formation[]
    categories?: Category[]
}

export function FormationsSlider({ formations = [], categories = [] }: FormationsSliderProps) {
    const t = useTranslations("Formations")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")

    const filteredFormations = selectedCategory === "all"
        ? formations
        : formations.filter(f => f.category_id === selectedCategory)

    // Fallback if no formations provided (optional, or just show empty)
    // For now we assume existing formations if passed are valid.

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t("title")}</h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        {t("description")}
                    </p>
                </div>

                <div className="flex justify-center mb-8">
                    <Tabs defaultValue="all" onValueChange={setSelectedCategory} className="w-full max-w-3xl">
                        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
                            <TabsTrigger value="all">All</TabsTrigger>
                            {categories.map((cat) => (
                                <TabsTrigger key={cat.id} value={cat.id}>
                                    {cat.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
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
                            {filteredFormations.length > 0 ? (
                                filteredFormations.map((formation) => (
                                    <CarouselItem key={formation.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                        <div className="p-1 h-full">
                                            <FormationCard
                                                id={formation.id}
                                                title={formation.title}
                                                description={formation.description}
                                                date={formation.date}
                                                price={formation.price}
                                                imageSrc={formation.image_url}
                                            />
                                        </div>
                                    </CarouselItem>
                                ))
                            ) : (
                                <div className="w-full text-center py-10 text-muted-foreground">
                                    No formations found in this category.
                                </div>
                            )}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            </div>
        </section>
    )
}
