'use client'

import { useState } from 'react'
import { FormationCard } from './formation-card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
    status?: string
    categories: Category[]
}

interface FormationsPageContentProps {
    formations: Formation[]
    categories: Category[]
}

export function FormationsPageContent({ formations = [], categories = [] }: FormationsPageContentProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    const filteredFormations =
        selectedCategory === 'all'
            ? formations
            : formations.filter((f) => f.categories.some((c) => c.id === selectedCategory))

    const activeCategories = categories.filter((cat) =>
        formations.some((f) => f.categories.some((c) => c.id === cat.id))
    )

    return (
        <section className="w-full">
            <div className="flex justify-center mb-12">
                <Tabs
                    defaultValue="all"
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    className="w-full flex flex-col items-center"
                >
                    <TabsList className="flex w-fit max-w-full mx-auto h-auto p-1.5 bg-muted/50 backdrop-blur border rounded-full gap-1 overflow-x-auto flex-wrap justify-center">
                        <TabsTrigger
                            value="all"
                            className="rounded-full px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            All
                        </TabsTrigger>
                        {activeCategories.map((cat) => (
                            <TabsTrigger
                                key={cat.id}
                                value={cat.id}
                                className="rounded-full px-6 py-2.5 text-sm font-medium transition-all whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                {cat.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {filteredFormations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFormations.map((formation) => (
                        <FormationCard
                            key={formation.id}
                            id={formation.id}
                            title={formation.title}
                            description={formation.description}
                            imageSrc={formation.image_url}
                            date={formation.date}
                            price={formation.price}
                            status={formation.status}
                        />
                    ))}
                </div>
            ) : (
                <div className="w-full text-center py-16 text-muted-foreground">
                    No formations found in this category.
                </div>
            )}
        </section>
    )
}
