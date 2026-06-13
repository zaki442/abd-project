import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { TeamSection } from "@/components/team-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { DonateSection } from "@/components/donate-section"
import { Footer } from "@/components/footer"
import { FormationsSlider } from "@/components/formations/formations-slider"
import { getFormations, getCategories } from "@/app/actions/admin"

export default async function Home() {
  const [formations, categories] = await Promise.all([
    getFormations(1, 1000, true),
    getCategories()
  ])

  // Extract data arrays from paginated responses
  const formationsArray = Array.isArray(formations) ? formations : formations.data || []

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <FormationsSlider formations={formationsArray} categories={categories} />
      <TeamSection />
      <TestimonialsSection />
      <DonateSection />
      <Footer />
    </main>
  )
}
