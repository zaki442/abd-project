"use client"

import { useTranslations } from "next-intl"
import { Newspaper, GraduationCap, Calendar } from "lucide-react"
import { Marquee } from "@/components/ui/marquee"
import { Link } from "@/i18n/routing"

type Blog = {
  id: string
  title: string
  created_at: string
}

type Formation = {
  id: string
  title: string
  date: string
}

export function NewsMarqueeClient({ blogs, formations }: { blogs: Blog[]; formations: Formation[] }) {
  const t = useTranslations("News")

  const items = [
    ...formations.map((f) => ({
      id: f.id,
      title: f.title,
      type: "formation" as const,
      href: `/formations/${f.id}`,
      meta: f.date,
    })),
    ...blogs.map((b) => ({
      id: b.id,
      title: b.title,
      type: "blog" as const,
      href: `/blogs/${b.id}`,
      meta: new Date(b.created_at).toLocaleDateString(),
    })),
  ]

  if (items.length === 0) return null

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-2">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-[#F5F2EC]">{t("title")}</span>
          </h2>
          <p className="text-[#C7C0B6]/80 max-w-2xl mx-auto text-lg">
            {t("description")}
          </p>
        </div>
      </div>

      <Marquee pauseOnHover duration="60s" className="[--gap:1.5rem]">
        {items.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            href={item.href}
            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#F5F2EC] border border-[#C7C0B6] hover:border-[#1A3761]/30 transition-all hover:shadow-lg min-w-[280px] max-w-[320px]"
          >
            <div className={`p-2 rounded-lg shrink-0 ${item.type === "formation" ? "bg-blue-400/10" : "bg-emerald-400/10"}`}>
              {item.type === "formation" ? (
                <GraduationCap className="w-5 h-5 text-blue-500" />
              ) : (
                <Newspaper className="w-5 h-5 text-emerald-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#1A3761] truncate">{item.title}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-[#1A3761]/50" />
                <span className="text-xs text-[#1A3761]/50">{item.meta}</span>
              </div>
            </div>
          </Link>
        ))}
      </Marquee>
    </section>
  )
}
