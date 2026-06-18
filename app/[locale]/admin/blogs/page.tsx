import { getBlogs } from '@/app/actions/admin'
import { BlogsManager } from '@/components/admin/blogs-manager'

export default async function AdminBlogsPage() {
    const result = await getBlogs()
    const blogs = result.data || []

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
                    <p className="text-muted-foreground">Manage community blog posts</p>
                </div>
            </div>
            <BlogsManager blogs={blogs} />
        </div>
    )
}
