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
            <div className="pt-24 pb-20">
                <RegistrationForm
                    formationId={formation.id}
                    formationName={formation.title}
                    formationDate={formation.date}
                    formationPrice={formation.price}
                    formationImageUrl={formation.image_url}
                />
            </div>
            <Footer />
        </main>
    )
}
