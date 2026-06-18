'use client'

import { Link } from '@/i18n/routing'
import { Calendar, User, ArrowRight } from 'lucide-react'

type Blog = {
    id: string
    title: string
    content: string
    image_url: string | null
    author: string
    status: string
    created_at: string
}

interface BlogsListProps {
    blogs: Blog[]
}

export function BlogsList({ blogs }: BlogsListProps) {
    if (blogs.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No blog posts yet.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
                <Link
                    key={blog.id}
                    href={`/blogs/${blog.id}`}
                    className="group rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                    {blog.image_url && (
                        <div className="aspect-video overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={blog.image_url}
                                alt={blog.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    )}
                    <div className="p-6 space-y-3">
                        <h2 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                            {blog.title}
                        </h2>
                        <p className="text-muted-foreground text-sm line-clamp-3">
                            {blog.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                            <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {blog.author}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(blog.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="flex items-center text-sm font-medium text-primary pt-2">
                            Read more <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
