import { getFormations, getCategories } from '@/app/actions/admin'
import { FormationsManager } from '@/components/admin/formations-manager'
import { getTranslations } from 'next-intl/server'

export default async function AdminFormationsPage() {
    const t = await getTranslations('Admin')
    
    const [formations, categories] = await Promise.all([
        getFormations(),
        getCategories(),
    ])

    // Extract data arrays from paginated responses
    const formationsArray = Array.isArray(formations) ? formations : formations.data || []

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Formations</h1>
                    <p className="text-muted-foreground">Manage training formations</p>
                </div>
            </div>
            <FormationsManager formations={formationsArray} categories={categories} />
        </div>
    )
}
