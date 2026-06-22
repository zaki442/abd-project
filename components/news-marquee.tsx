import { getBlogs } from "@/app/actions/admin"
import { getFormations } from "@/app/actions/admin"
import { NewsMarqueeClient } from "./news-marquee-client"

export async function NewsMarquee() {
  const [blogsRes, formationsRes] = await Promise.all([
    getBlogs(1, 100, true),
    getFormations(1, 100, false),
  ])

  const blogs = Array.isArray(blogsRes) ? blogsRes : blogsRes.data || []
  const allFormations = Array.isArray(formationsRes) ? formationsRes : formationsRes.data || []
  const formations = allFormations.filter((f: { status?: string }) => f.status === "ACTIVE")

  return <NewsMarqueeClient blogs={blogs} formations={formations} />
}
