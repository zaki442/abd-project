import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DonateSection() {
  const t = useTranslations("Donate")
  const tNav = useTranslations("Navbar")

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5 border-y border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <Heart className="w-8 h-8 text-primary fill-primary animate-pulse" />
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("description")}
        </p>
        <div className="pt-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 h-14 rounded-full shadow-lg hover:shadow-xl transition-all">
            <Link href="/donate">
              <Heart className="w-5 h-5 mr-2 fill-current" />
              {tNav("donate")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
