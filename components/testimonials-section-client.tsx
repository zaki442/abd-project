"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, Minus } from "lucide-react"
import { Marquee } from "@/components/ui/marquee"
import { cn } from "@/lib/utils"

type Feedback = {
  id: string
  full_name: string
  email?: string
  role?: string
  feedback: string
  created_at: string
}

const ReviewCard = ({
  name,
  role,
  body,
}: {
  name: string
  role?: string
  body: string
}) => {
  const [expanded, setExpanded] = useState(false)
  const isLong = body.length > 100
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <figure
      className={cn(
        "relative w-72 rounded-xl border p-5 transition-all",
        "border-[#C7C0B6] bg-[#F5F2EC]",
        expanded ? "cursor-default" : "cursor-pointer hover:bg-[#F5F2EC]/90",
      )}
      onClick={() => isLong && setExpanded(!expanded)}
    >
      <div className="flex flex-row items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-[#1A3761] flex items-center justify-center text-[#F5F2EC] text-sm font-bold shrink-0">
          {initials}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <figcaption className="text-sm font-medium text-[#1A3761] truncate">
            {name}
          </figcaption>
          {role && (
            <p className="text-xs font-medium text-[#1A3761]/60 truncate">{role}</p>
          )}
        </div>
        {isLong && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
            className="shrink-0 w-6 h-6 rounded-full bg-[#1A3761]/10 flex items-center justify-center hover:bg-[#1A3761]/20 transition-colors"
          >
            {expanded ? (
              <Minus className="w-3.5 h-3.5 text-[#1A3761]" />
            ) : (
              <Plus className="w-3.5 h-3.5 text-[#1A3761]" />
            )}
          </button>
        )}
      </div>
      <blockquote
        className={cn(
          "text-sm text-[#1A3761]/80 leading-relaxed",
          !expanded && "line-clamp-3",
        )}
      >
        {body}
      </blockquote>
    </figure>
  )
}

export function TestimonialsSectionClient({ feedbacks }: { feedbacks: Feedback[] }) {
  const t = useTranslations("Community")

  if (feedbacks.length === 0) return null

  return (
    <section className="py-24 bg-[#C7C0B6]/20">
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#F5F2EC]">
          {t("title")} <span className="text-[#C7C0B6]">Love</span>
        </h2>
        <p className="text-[#C7C0B6]/80 max-w-2xl mx-auto text-lg">
          {t("description")}
        </p>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent">
        <Marquee pauseOnHover className="[--duration:20s]">
          {feedbacks.map((fb) => (
            <ReviewCard key={fb.id} name={fb.full_name} role={fb.role} body={fb.feedback} />
          ))}
        </Marquee>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#1A3761] to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#1A3761] to-transparent"></div>
      </div>
    </section>
  )
}
