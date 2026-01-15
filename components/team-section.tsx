import { Card, CardContent } from "@/components/ui/card"

const team = [
  { name: "Youness", role: "Community Lead", initials: "YN" },
  { name: "Siham", role: "Operations", initials: "SH" },
  { name: "Zakaria", role: "Tech", initials: "ZK" },
  { name: "Ayoub", role: "Tech", initials: "AY" },
  { name: "Anass", role: "Content", initials: "AN" },
  { name: "Khadija", role: "Events", initials: "KH" },
  { name: "Ed-daoudi", role: "Media", initials: "ED" },
  { name: "Naima", role: "Partnerships", initials: "NM" },
  { name: "Soukaina", role: "Coordinator", initials: "SK" },
]

const roleColors: Record<string, string> = {
  "Community Lead": "from-purple-500 to-pink-500",
  Operations: "from-blue-500 to-cyan-500",
  Tech: "from-green-500 to-emerald-500",
  Content: "from-orange-500 to-yellow-500",
  Events: "from-pink-500 to-rose-500",
  Media: "from-indigo-500 to-purple-500",
  Partnerships: "from-teal-500 to-green-500",
  Coordinator: "from-violet-500 to-indigo-500",
}

export function TeamSection() {
  return (
    <section id="team" className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Our Team</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Meet the passionate individuals driving the Agile B Darija community forward.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {team.map((member, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-primary/50 transition-all duration-300 group"
            >
              <CardContent className="p-4 sm:p-6 text-center">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${roleColors[member.role] || "from-purple-500 to-pink-500"} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  <span className="text-lg sm:text-xl font-bold text-white">{member.initials}</span>
                </div>
                <h3 className="font-semibold text-foreground text-sm sm:text-base">{member.name}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mt-1">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
