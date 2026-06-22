"use client"

import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { Clock, History, Send, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FormationCard } from "@/components/formations/formation-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

type Category = {
  id: string
  name: string
}

type Formation = {
  id: string
  title: string
  description: string
  date: string
  price: string
  image_url: string
  status?: string
  is_certified?: boolean
  categories: Category[]
}

interface FormationsPageProps {
  formations: Formation[]
  categories: Category[]
}

export function FormationsPageContent({ formations, categories }: FormationsPageProps) {
  const t = useTranslations("Formations")

  const currentFormations = useMemo(() => {
    return formations.filter((f) => f.status === "ACTIVE")
  }, [formations])

  const pastFormations = useMemo(() => {
    return formations.filter((f) => f.status !== "ACTIVE")
  }, [formations])

  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredCurrent =
    selectedCategory === "all"
      ? currentFormations
      : currentFormations.filter((f) => f.categories.some((c) => c.id === selectedCategory))

  const activeCategories = categories.filter((cat) =>
    currentFormations.some((f) => f.categories.some((c) => c.id === cat.id))
  )

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              {t("title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          {/* Current & Upcoming Formations */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-400/10">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{t("upcoming")}</h2>
            </div>

            <div className="flex justify-center">
              <Tabs
                defaultValue="all"
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                className="w-full flex flex-col items-center"
              >
                <TabsList className="flex w-fit max-w-full mx-auto h-auto p-1.5 bg-muted/50 backdrop-blur border rounded-full gap-1 overflow-x-auto flex-wrap justify-center">
                  <TabsTrigger
                    value="all"
                    className="rounded-full px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    All
                  </TabsTrigger>
                  {activeCategories.map((cat) => (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.id}
                      className="rounded-full px-6 py-2.5 text-sm font-medium transition-all whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      {cat.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {filteredCurrent.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCurrent.map((formation) => (
                  <FormationCard
                    key={formation.id}
                    id={formation.id}
                    title={formation.title}
                    description={formation.description}
                    imageSrc={formation.image_url}
                    date={formation.date}
                    price={formation.price}
                    status={formation.status}
                    isCertified={formation.is_certified}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                No formations found.
              </div>
            )}
          </div>

          {/* Past Formations */}
          {pastFormations.length > 0 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-muted/50">
                  <History className="w-6 h-6 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t("history")}</h2>
              </div>
              <p className="text-muted-foreground -mt-4">{t("historyDesc")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                {pastFormations.map((formation) => (
                  <FormationCard
                    key={formation.id}
                    id={formation.id}
                    title={formation.title}
                    description={formation.description}
                    imageSrc={formation.image_url}
                    date={formation.date}
                    price={formation.price}
                    status={formation.status}
                    isCertified={formation.is_certified}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Request a Formation */}
          <div className="rounded-xl border border-border bg-card/50 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Send className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{t("request")}</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">{t("requestDesc")}</p>
            <Button asChild>
              <a href="mailto:agilebdarija@gmail.com">
                {t("requestCta")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
