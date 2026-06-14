import { getFormations, getCategories } from '@/app/actions/admin'
import { FormationsPageContent } from '@/components/formations/formations-page-content'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getTranslations } from 'next-intl/server'

export default async function FormationsPage() {
    const [formations, categories] = await Promise.all([
        getFormations(1, 1000, false),
        getCategories(),
    ])
    const t = await getTranslations('Formations')

    // Extract data arrays from paginated responses
    const formationsArray = Array.isArray(formations) ? formations : formations.data || []

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-16">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                            {t('title')}
                        </h1>
                        <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                            {t('description')}
                        </p>
                    </div>
                    <FormationsPageContent formations={formationsArray} categories={categories} />
                </div>
            </div>
            <Footer />
        </main>
    )
}
