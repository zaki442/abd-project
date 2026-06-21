"use client"

import { useTranslations } from "next-intl"
import { CheckCircle2, Target, Sparkles, Users, GraduationCap, Globe, HeartHandshake, Lightbulb, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const milestones = [
  {
    period: "past",
    icon: Lightbulb,
    items: [
      { title: "Community Founded", desc: "Agile B Darija was born — a vision to make Agile accessible in Moroccan Darija." },
      { title: "First Formation", desc: "Launched our first free Agile formation, welcoming dozens of participants." },
      { title: "WhatsApp Community", desc: "Grew to 500+ members on WhatsApp, becoming a hub for Agile discussions." },
    ],
  },
  {
    period: "present",
    icon: Target,
    items: [
      { title: "Regular Formations", desc: "Running weekly formations covering Agile, Scrum, Design Thinking, and more." },
      { title: "Community Events", desc: "Hosting workshops, talks, and networking events for practitioners." },
      { title: "Online Presence", desc: "Building our blog and resources to reach a wider audience across Morocco." },
    ],
  },
  {
    period: "future",
    icon: Sparkles,
    items: [
      { title: "Certification Program", desc: "Establishing accredited Agile certification paths for our members." },
      { title: "Corporate Partnerships", desc: "Partnering with companies to bridge the gap between learning and industry." },
      { title: "National Reach", desc: "Expanding to multiple cities across Morocco with local chapters." },
    ],
  },
]

const periodConfig = {
  past: { color: "border-[#C7C0B6]", bg: "bg-[#C7C0B6]/10", iconColor: "text-[#C7C0B6]" },
  present: { color: "border-blue-400", bg: "bg-blue-400/10", iconColor: "text-blue-400" },
  future: { color: "border-emerald-400", bg: "bg-emerald-400/10", iconColor: "text-emerald-400" },
}

const periodIcons = {
  past: CheckCircle2,
  present: ArrowRight,
  future: Sparkles,
}

export default function RoadmapPage() {
  const t = useTranslations("Roadmap")

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              {t("title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          <div className="space-y-12">
            {milestones.map((milestone) => {
              const Icon = milestone.icon
              const config = periodConfig[milestone.period as keyof typeof periodConfig]
              const PeriodIcon = periodIcons[milestone.period as keyof typeof periodIcons]

              return (
                <div key={milestone.period} className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2.5 rounded-xl ${config.bg}`}>
                      <Icon className={`w-6 h-6 ${config.iconColor}`} />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      {t(milestone.period)}
                      <PeriodIcon className={`w-5 h-5 ${config.iconColor}`} />
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {milestone.items.map((item) => (
                      <div
                        key={item.title}
                        className={`relative p-5 rounded-xl border ${config.color} ${config.bg} backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
                      >
                        <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
