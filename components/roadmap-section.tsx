"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Circle, Clock, CheckCircle2, List } from "lucide-react"
import { useTranslations } from "next-intl"

// Trello Constants
const API_KEY = process.env.NEXT_PUBLIC_TRELLO_API_KEY
const TOKEN = process.env.NEXT_PUBLIC_TRELLO_TOKEN
const BOARD_ID = process.env.NEXT_PUBLIC_TRELLO_BOARD_ID

interface TrelloList {
  id: string
  name: string
  pos: number
}

interface TrelloCard {
  id: string
  name: string
  idList: string
  desc?: string
  labels?: { id: string; name: string; color: string }[]
  dateLastActivity: string
}

// Color and Icon cycling for lists
const styleVariants = [
  { icon: Circle, color: "text-muted-foreground", bgColor: "bg-muted/50" },
  { icon: Clock, color: "text-blue-400", bgColor: "bg-blue-500/10" },
  { icon: CheckCircle2, color: "text-green-400", bgColor: "bg-green-500/10" },
  { icon: List, color: "text-purple-400", bgColor: "bg-purple-500/10" },
  { icon: List, color: "text-orange-400", bgColor: "bg-orange-500/10" },
  { icon: List, color: "text-sky-400", bgColor: "bg-sky-500/10" },
]

export function RoadmapSection() {
  const [lists, setLists] = useState<TrelloList[]>([])
  const [cards, setCards] = useState<TrelloCard[]>([])
  const [loading, setLoading] = useState(true)
  const t = useTranslations("Roadmap")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch Lists
        const listsRes = await fetch(
          `https://api.trello.com/1/boards/${BOARD_ID}/lists?key=${API_KEY}&token=${TOKEN}`
        )
        if (!listsRes.ok) throw new Error("Failed to fetch lists")
        const listsData = await listsRes.json()

        // Fetch Cards
        const cardsRes = await fetch(
          `https://api.trello.com/1/boards/${BOARD_ID}/cards?key=${API_KEY}&token=${TOKEN}`
        )
        if (!cardsRes.ok) throw new Error("Failed to fetch cards")
        const cardsData = await cardsRes.json()

        setLists(listsData)
        setCards(cardsData)
      } catch (err) {
        console.error("Failed to fetch Trello data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Sort lists by position and filter for specific ABD lists
  const sortedLists = [...lists]
    .sort((a, b) => a.pos - b.pos)
    .filter((list) => ["ABD Departments", "ABD Activities"].includes(list.name))

  return (
    <section id="roadmap" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">{t("title")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t("description")}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedLists.map((list, index) => {
              const listCards = cards.filter((card) => card.idList === list.id)
              // Cycle through styles
              const style = styleVariants[index % styleVariants.length]
              const Icon = style.icon

              return (
                <Card key={list.id} className="bg-card border-border h-full flex flex-col">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className={`w-5 h-5 ${style.color}`} />
                      <span className="text-foreground truncate" title={list.name}>{list.name}</span>
                      <span className="ml-auto text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-full shrink-0">
                        {listCards.length}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
                    {listCards.length === 0 ? (
                      <div className="text-sm text-muted-foreground/50 text-center py-4 italic">
                        {t("noItems")}
                      </div>
                    ) : (
                      listCards.map((card) => (
                        <div
                          key={card.id}
                          className={`p-4 rounded-lg ${style.bgColor} border border-border hover:border-primary/30 transition-colors cursor-pointer group`}
                        >
                          <div className="flex flex-col gap-2">
                            {/* Labels */}
                            {card.labels && card.labels.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {card.labels.map((label) => (
                                  <span
                                    key={label.id}
                                    className={`text-[8px] sm:text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm opacity-75`}
                                    style={{
                                      backgroundColor: label.color ? `var(--color-${label.color}-500)` : '#64748b',
                                      color: 'white' // Assuming dark mode or contrasting text
                                    }}
                                  >
                                    {label.name || ""}
                                    {/* If label has no name, we might just show color stripe. 
                                                    But Trello labels often have names. If empty, maybe just a colored dot or stripe?
                                                    For this design, let's keep it simple. If name is empty, it might be an empty box.
                                                */}
                                  </span>
                                ))}
                              </div>
                            )}
                            <p className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                              {card.name}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
