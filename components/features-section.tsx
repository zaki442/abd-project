import { Card, CardContent } from "@/components/ui/card"
import { Users, FlaskConical, Heart, Briefcase } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

export function FeaturesSection() {
  const t = useTranslations("Features")

  const features = [
    {
      icon: Users,
      title: t("culture.title"),
      description: t("culture.desc"),
    },
    {
      icon: FlaskConical,
      title: t("practice.title"),
      description: t("practice.desc"),
    },
    {
      icon: Heart,
      title: t("impact.title"),
      description: t("impact.desc"),
    },
    {
      icon: Briefcase,
      title: t("network.title"),
      description: t("network.desc"),
    },
  ]

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-[#F5F2EC]">{t("mission")}</span>
          </h2>
          <p className="text-[#C7C0B6]/80 max-w-2xl mx-auto text-lg">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-[#F5F2EC] border-[#C7C0B6] hover:border-[#1A3761]/50 transition-all duration-300 group shadow-lg hover:shadow-xl"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-[#1A3761] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-[#F5F2EC]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#1A3761]">{feature.title}</h3>
                <p className="text-[#1A3761]/70 text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1A3761] text-[#F5F2EC] hover:bg-[#1A3761]/90 transition-all duration-200 font-medium text-sm"
          >
            {t("learnMore")}
          </Link>
        </div>
      </div>
    </section>
  )
}
