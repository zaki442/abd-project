import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { TeamSection } from "@/components/team-section"
import { RoadmapSection } from "@/components/roadmap-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/footer"
import { FormationsSlider } from "@/components/formations/formations-slider"
import { getFormations, getCategories } from "@/app/actions/admin"

export default async function Home() {
  const [formations, categories] = await Promise.all([
    getFormations(),
    getCategories()
  ])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <FormationsSlider formations={formations} categories={categories} />
      <TeamSection />
      <RoadmapSection />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}
