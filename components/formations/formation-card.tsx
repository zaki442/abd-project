import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RegistrationModal } from './registration-modal'
import Image from 'next/image'

interface FormationCardProps {
    id: string
    title: string
    description: string
    imageSrc: string
    date: string
    price: string
}

export function FormationCard({ id, title, description, imageSrc, date, price }: FormationCardProps) {
    return (
        <Card className="h-full flex flex-col justify-between overflow-hidden border-2 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
            <div className="relative aspect-video w-full overflow-hidden">
                {/* Placeholder image logic - using dynamic generation for now if no src provided */}
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                    {/* In a real app we'd use Next.js Image with real assets, using placeholder for now */}
                    <span className="text-4xl font-bold opacity-20">{title.charAt(0)}</span>
                </div>
            </div>

            <CardHeader>
                <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                <CardDescription className="text-lg font-medium text-primary">
                    {date} • {price}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-grow">
                <p className="text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </CardContent>

            <CardFooter>
                <RegistrationModal formationId={id} formationName={title} />
            </CardFooter>
        </Card>
    )
}
