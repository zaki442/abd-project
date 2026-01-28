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
        <Card className="group h-full flex flex-col justify-between overflow-hidden border-0 bg-background/60 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-bold">{price}</p>
                </div>
            </div>

            <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                    <CardDescription className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {date}
                    </CardDescription>
                </div>
                <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {description}
                </p>
            </CardContent>

            <CardFooter className="pt-0">
                <RegistrationModal formationId={id} formationName={title} />
            </CardFooter>
        </Card>
    )
}
