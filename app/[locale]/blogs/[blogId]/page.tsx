import { getBlog } from '@/app/actions/admin'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Link } from '@/i18n/routing'
import { ArrowLeft, Calendar, User } from 'lucide-react'

export default async function BlogDetailPage({
    params,
}: {
    params: Promise<{ blogId: string }>
}) {
    const { blogId } = await params
    const blog = await getBlog(blogId)

    if (!blog) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-32 pb-20">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to blogs
                    </Link>

                    <article className="space-y-8">
                        {blog.image_url && (
                            <div className="aspect-video rounded-xl overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={blog.image_url}
                                    alt={blog.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-tight">{blog.title}</h1>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {blog.author}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(blog.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                            {blog.content}
                        </div>
                    </article>
                </div>
            </div>
            <Footer />
        </main>
    )
}
