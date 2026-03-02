import { getCategories } from '@/app/actions/admin'
import { CategoriesManager } from '@/components/admin/categories-manager'
import { getTranslations } from 'next-intl/server'

export default async function AdminCategoriesPage() {
    const t = await getTranslations('Admin')
    
    const categories = await getCategories()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">Manage formation categories</p>
                </div>
            </div>
            <CategoriesManager categories={categories} />
        </div>
    )
}
