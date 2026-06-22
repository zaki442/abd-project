import { getFormations, getCategories } from '@/app/actions/admin'
import { FormationsPageContent } from '@/components/formations/formations-page-content'

export default async function FormationsPage() {
    const [formations, categories] = await Promise.all([
        getFormations(1, 1000, false),
        getCategories(),
    ])

    const formationsArray = Array.isArray(formations) ? formations : formations.data || []

    return <FormationsPageContent formations={formationsArray} categories={categories} />
}
