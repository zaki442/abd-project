import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Circle, Clock, CheckCircle2 } from "lucide-react"

const columns = [
  {
    title: "Backlog",
    icon: Circle,
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
    items: ["Partnerships with Tech Companies", "Online Courses Platform", "Regional Chapter Expansion"],
  },
  {
    title: "In Progress",
    icon: Clock,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    items: ["Launch Website", "Discord Community Setup", "Content Calendar 2025"],
  },
  {
    title: "Completed",
    icon: CheckCircle2,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    items: ["First Casablanca Meetup", "Community Onboarding", "Trello Board Setup"],
  },
]

export function RoadmapSection() {
  return (
    <section id="roadmap" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Sprint Board</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Track our progress as we build and grow the Agile B Darija community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column, colIndex) => (
            <Card key={colIndex} className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <column.icon className={`w-5 h-5 ${column.color}`} />
                  <span className="text-foreground">{column.title}</span>
                  <span className="ml-auto text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    {column.items.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {column.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className={`p-4 rounded-lg ${column.bgColor} border border-border hover:border-primary/30 transition-colors cursor-pointer`}
                  >
                    <p className="text-sm text-foreground font-medium">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
