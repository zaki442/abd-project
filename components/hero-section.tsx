import { useTranslations } from "next-intl"

export function HeroSection() {
  const t = useTranslations("Hero")

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background gradient effects using new palette */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#F5F2EC]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-1/4 w-96 h-96 bg-[#C7C0B6]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#1A3761]/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C7C0B6]/30 border border-[#C7C0B6]/50 backdrop-blur-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-[#F5F2EC] animate-pulse" />
          <span className="text-sm text-[#F5F2EC]">{t("community")}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          <span className="text-[#F5F2EC]">{t("title")}</span>
          <br />
          <span className="text-[#C7C0B6]">{t("slogan")}</span>
        </h1>

        <p className="text-lg sm:text-xl text-[#C7C0B6]/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("description")}
        </p>

      </div>
    </section>
  )
}
