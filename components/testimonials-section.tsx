import { Marquee } from "@/components/ui/marquee"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

// Mock data for testimonials
const reviews = [
    {
        name: "Yassine Benjelloun",
        username: "@ybenjelloun",
        body: "Agile B Darija beddelat lia chouf dyali l gestion de projet. L'communauté wa3ra o kat3awen bzaf.",
        img: "https://i.pravatar.cc/150?u=yassine",
    },
    {
        name: "Sara El Amrani",
        username: "@sara_el",
        body: "Les ateliers kanou top. Fhamt Scrum hsen mli tchrah b Darija, bsat lia l concepts s3ab.",
        img: "https://i.pravatar.cc/150?u=sara",
    },
    {
        name: "Omar Tazi",
        username: "@otazi_dev",
        body: "Akhiran lqina communauté tech f lmeghrib kadwi b lougha dyalna. Networking hna fih feras wa3ra.",
        img: "https://i.pravatar.cc/150?u=omar",
    },
    {
        name: "Hajar Alami",
        username: "@hajar_scrum",
        body: "Lqit awel khedma dyali k Scrum Master b sbab tawjih li khdit hna. Chokran bzaf!",
        img: "https://i.pravatar.cc/150?u=hajar",
    },
    {
        name: "Karim Idrissi",
        username: "@karim_i",
        body: "L content dima nqi o niveau tali. Hwa lmerje3 dyali l best practices d Agile f lmeghrib.",
        img: "https://i.pravatar.cc/150?u=karim",
    },
    {
        name: "Nadia Bennani",
        username: "@nadia_b",
        body: "Khdemt f les projets dyal l communauté o khdit l'expérience li kant khassani.",
        img: "https://i.pravatar.cc/150?u=nadia",
    },
]

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string
    name: string
    username: string
    body: string
}) => {
    return (
        <figure
            className={cn(
                "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-[#C7C0B6] bg-[#F5F2EC] hover:bg-[#F5F2EC]/90",
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium text-[#1A3761]">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium text-[#1A3761]/60">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm text-[#1A3761]/80">{body}</blockquote>
        </figure>
    )
}

export function TestimonialsSection() {
    const t = useTranslations("Community")

    return (
        <section className="py-24 bg-[#C7C0B6]/20">
            <div className="text-center mb-12 px-4">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#F5F2EC]">
                    {t("title")} <span className="text-[#C7C0B6]">Love</span>
                </h2>
                <p className="text-[#C7C0B6]/80 max-w-2xl mx-auto text-lg">
                    {t("description")}
                </p>
            </div>

            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent">
                <Marquee pauseOnHover className="[--duration:20s]">
                    {reviews.map((review) => (
                        <ReviewCard key={review.username} {...review} />
                    ))}
                </Marquee>


                {/* Gradients for fade effect on edges */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#1A3761] to-transparent"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#1A3761] to-transparent"></div>
            </div>
        </section>
    )
}
