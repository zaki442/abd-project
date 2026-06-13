import { Card, CardContent } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import Image from "next/image"

const team = [
  { name: "Youness ID-BENSALAH ", role: "Community Lead", initials: "YN", image: "/team/youness.jpg" },
  { name: "Siham Haddany", role: "Operations", initials: "SH", image: "/team/siham.jpg" },
  { name: "Zakaria Abid", role: "Tech", initials: "ZA" },
  { name: "Abdelouahed EdDdaoudy", role: "Media", initials: "ED", image: "/team/abdelouahed.jpg" },
  { name: "Soukaina Bouchane", role: "Communication", initials: "SK", image: "/team/soukaina.jpg" },
  { name: "Khadija Afkir", role: "EventsWorkshop", initials: "KA" },
  { name: "Rajae", role: "Marketing", initials: "RA" },
]

const roleColors: Record<string, string> = {
  "Community Lead": "from-[#1A3761] to-[#C7C0B6]",
  Operations: "from-[#1A3761] to-[#F5F2EC]",
  Tech: "from-[#C7C0B6] to-[#F5F2EC]",
  Content: "from-[#1A3761] to-[#C7C0B6]",
  Events: "from-[#F5F2EC] to-[#C7C0B6]",
  EventsWorkshop: "from-[#F5F2EC] to-[#C7C0B6]",
  Media: "from-[#1A3761] to-[#F5F2EC]",
  Partnerships: "from-[#C7C0B6] to-[#1A3761]",
  Communication: "from-[#1A3761] to-[#C7C0B6]",
  Marketing: "from-[#1A3761] to-[#F5F2EC]",
}

export function TeamSection() {
  const t = useTranslations("Team")

  return (
    <section id="team" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#C7C0B6]/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-[#F5F2EC]">{t("title")}</span>
          </h2>
          <p className="text-[#C7C0B6]/80 max-w-2xl mx-auto text-lg">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {team.map((member, index) => (
            <Card
              key={index}
              className="bg-[#F5F2EC] border-[#C7C0B6] hover:border-[#1A3761]/50 transition-all duration-300 group shadow-lg hover:shadow-xl"
            >
              <CardContent className="p-4 sm:p-6 text-center">
                {member.image ? (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mx-auto mb-4 group-hover:scale-110 transition-transform ring-2 ring-[#1A3761]/30">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${roleColors[member.role] || "from-[#1A3761] to-[#C7C0B6]"} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <span className="text-lg sm:text-xl font-bold text-white">{member.initials}</span>
                  </div>
                )}
                <h3 className="font-semibold text-[#1A3761] text-sm sm:text-base">{member.name}</h3>
                <p className="text-[#1A3761]/70 text-xs sm:text-sm mt-1">{t(`roles.${member.role}` as any)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
