"use client"

import { useTranslations } from "next-intl"
import { Heart, FlaskConical, Users, Briefcase, History, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Link } from "@/i18n/routing"

const sections = [
  { key: "social", icon: Heart, color: "text-red-400", bg: "bg-red-400/10" },
  { key: "practice", icon: FlaskConical, color: "text-blue-400", bg: "bg-blue-400/10" },
  { key: "community", icon: Users, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { key: "entrepreneurship", icon: Briefcase, color: "text-amber-400", bg: "bg-amber-400/10" },
]

export default function ActivitiesPage() {
  const t = useTranslations("Activities")

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              {t("title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {sections.map(({ key, icon: Icon, color, bg }) => (
              <div
                key={key}
                className="p-6 rounded-xl border border-border bg-card/50 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{t(`${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`${key}.desc`)}</p>
              </div>
            ))}
          </div>

          {/* History Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-muted/50">
                <History className="w-6 h-6 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{t("history.title")}</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl">{t("history.desc")}</p>

            <div className="rounded-xl border border-border bg-card/50 p-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                {[
                  { icon: Users, label: "Community Meetups", count: "12+" },
                  { icon: FlaskConical, label: "Workshops", count: "8+" },
                  { icon: Briefcase, label: "Formations", count: "6+" },
                  { icon: Heart, label: "Social Projects", count: "4+" },
                ].map(({ icon: Icon, label, count }) => (
                  <div key={label} className="space-y-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{count}</div>
                    <div className="text-sm text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/formations"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                View all formations <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
