"use client"

import { useTranslations } from "next-intl"
import { Building2, Copy, CheckCircle2, CreditCard, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function DonatePage() {
  const t = useTranslations("Donate")
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const cihDetails = [
    // { label: t("cih.accountHolder"), value: "ZAKARIA ABID", field: "holder" },
    { label: t("cih.rib"), value: "230 121 9307070211028600 43", field: "rib" },
    { label: t("cih.iban"), value: "MA64 2301 2193 0707 0211 0286 0043", field: "iban" },
    { label: t("cih.swift"), value: "CIHMMAMC", field: "swift" },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              {t("title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* PayPal Card */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors">
                <CardHeader className="pt-8">
                  <div className="w-12 h-12 bg-[#00457C]/10 rounded-lg flex items-center justify-center mb-4">
                    <CreditCard className="w-6 h-6 text-[#0079C1]" />
                  </div>
                  <CardTitle>{t("paypal.title")}</CardTitle>
                  <CardDescription>{t("paypal.description")}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex items-end">
                  <Button 
                    className="w-full bg-[#0079C1] hover:bg-[#00457C] text-white group"
                    asChild
                  >
                    <a href="https://paypal.me/ZakariaAbid" target="_blank" rel="noopener noreferrer">
                      {t("paypal.button")}
                      <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* CIH Bank Card */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <Card className="h-full bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors">
                <CardHeader className="pt-8">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6 text-red-500" />
                  </div>
                  <CardTitle>{t("cih.title")}</CardTitle>
                  <CardDescription>{t("cih.description")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cihDetails.map((detail) => (
                    <div key={detail.field} className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {detail.label}
                      </label>
                      <div className="flex items-center justify-between p-3 bg-background rounded-md border border-border group hover:border-primary/30 transition-colors">
                        <span className="font-mono text-sm break-all">{detail.value}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => copyToClipboard(detail.value, detail.field)}
                          title={t("cih.copy")}
                        >
                          {copiedField === detail.field ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                          <span className="sr-only">{t("cih.copy")}</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
