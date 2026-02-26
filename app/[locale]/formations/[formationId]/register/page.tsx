import { getFormation } from '@/app/actions/admin'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { RegistrationForm } from '@/components/formations/registration-form'

export default async function RegisterFormationPage({
    params,
}: {
    params: Promise<{ formationId: string }>
}) {
    const { formationId } = await params
    const formation = await getFormation(formationId)

    if (!formation) {
        notFound()
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-16">
                <div className="container mx-auto px-4 md:px-6 max-w-lg">
                    <RegistrationForm
                        formationId={formation.id}
                        formationName={formation.title}
                    />
                </div>
            </div>
            <Footer />
        </main>
    )
}
