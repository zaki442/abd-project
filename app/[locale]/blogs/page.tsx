import { getBlogs } from '@/app/actions/admin'
import { BlogsList } from '@/components/blogs/blogs-list'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getTranslations } from 'next-intl/server'

export default async function BlogsPage() {
    const result = await getBlogs(1, 1000, true)
    const blogs = result.data || []
    const t = await getTranslations('Blogs')

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
                    <BlogsList blogs={blogs} />
                </div>
            </div>
            <Footer />
        </main>
    )
}
