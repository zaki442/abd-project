import { Card, CardContent } from "@/components/ui/card"
import { Users, FlaskConical, Heart, Briefcase } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Community Culture",
    description: "A vibrant space where Agile enthusiasts connect, share experiences, and build lasting relationships.",
  },
  {
    icon: FlaskConical,
    title: "Practice & Experimentation",
    description: "Hands-on workshops, sprints, and real-world projects to sharpen your Agile skills through practice.",
  },
  {
    icon: Heart,
    title: "Social Impact",
    description:
      "Leveraging Agile methodologies for social good through associative projects and community initiatives.",
  },
  {
    icon: Briefcase,
    title: "Professional Network",
    description:
      "Connect with industry leaders, find mentors, and discover career opportunities in the Agile ecosystem.",
  },
]

export function FeaturesSection() {
  return (
    <section id="vision" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Our Mission</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Empowering the Moroccan Agile community through collaboration, education, and real-world impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-primary/50 transition-all duration-300 group"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
