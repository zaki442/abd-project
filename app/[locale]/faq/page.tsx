"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ChevronDown } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const faqItems = [
  { key: "whatIs", question: "What is Agile B Darija?", answer: "Agile B Darija is a Moroccan community for Agile practitioners, students, and leaders to collaborate, learn, and grow together." },
  { key: "whoCanJoin", question: "Who can join?", answer: "Anyone interested in Agile methodologies — from beginners to experienced practitioners — is welcome to join our community." },
  { key: "howToJoin", question: "How can I join?", answer: "You can join our WhatsApp or Telegram community through the links on our homepage, or follow us on social media for updates." },
  { key: "formations", question: "Are the formations free?", answer: "Yes, all our formations are currently free. We believe in making Agile education accessible to everyone in Morocco." },
  { key: "certificate", question: "Do you provide certificates?", answer: "Yes, participants who complete our formations receive a certificate of participation." },
]

export default function FAQPage() {
  const t = useTranslations("FAQ")
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-24 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              {t("title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          <div className="space-y-2">
            {faqItems.map((item) => (
              <div key={item.key} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenItem(openItem === item.key ? null : item.key)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-muted/50 transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                      openItem === item.key ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openItem === item.key && (
                  <div className="px-4 pb-4 text-muted-foreground">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
