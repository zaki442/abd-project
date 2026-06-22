import { getFeedbacks } from "@/app/actions/feedbacks"
import { TestimonialsSectionClient } from "./testimonials-section-client"

export async function TestimonialsSection() {
  const { data } = await getFeedbacks()
  const feedbacks = data || []

  return <TestimonialsSectionClient feedbacks={feedbacks} />
}
