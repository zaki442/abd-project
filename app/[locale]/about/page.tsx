"use client"

import { useTranslations } from "next-intl"
import { Target, Lightbulb, Heart, Users, Sparkles, GraduationCap, Globe, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const valueIcons = [Users, Heart, Lightbulb, Globe, Sparkles]

export default function AboutPage() {
  const t = useTranslations("About")
  const objectives = t.raw("objectivesList") as string[]
  const values = t.raw("valuesList") as { title: string; desc: string }[]

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto space-y-20">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              {t("title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("description")}
            </p>
          </div>

          {/* Mission */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-400/10">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{t("mission")}</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {t("missionDesc")}
            </p>
          </div>

          {/* Objectives */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-400/10">
                <GraduationCap className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{t("objectives")}</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {objectives.map((obj, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/50"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-400/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-emerald-400">{i + 1}</span>
                  </div>
                  <p className="text-muted-foreground">{obj}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/10">
                <Heart className="w-6 h-6 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{t("values")}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {values.map((value, i) => {
                const Icon = valueIcons[i % valueIcons.length]
                return (
                  <div
                    key={i}
                    className="p-5 rounded-xl border border-border bg-card/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Org Chart */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-400/10">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Organigramme</h2>
            </div>
            <div className="p-8 rounded-xl border border-border bg-card/50">
              <div className="flex flex-col items-center gap-6">
                {/* Top - Community Lead */}
                <div className="px-6 py-3 rounded-lg bg-[#1A3761] text-[#F5F2EC] font-semibold shadow-lg">
                  Community Lead
                </div>

                {/* Lines connecting */}
                <div className="w-px h-6 bg-border" />

                {/* Departments */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  {[
                    "Operations",
                    "Tech",
                    "Content",
                    "Events",
                    "Media",
                    "Partnerships",
                    "Communication",
                    "Marketing",
                  ].map((dept) => (
                    <div
                      key={dept}
                      className="px-4 py-2.5 rounded-lg bg-card border border-border text-center text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
                    >
                      {dept}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
