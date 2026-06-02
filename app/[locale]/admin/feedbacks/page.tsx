import { getFeedbacks } from "@/app/actions/feedbacks"
import { FeedbacksManager } from "@/components/admin/feedbacks-manager"

export default async function AdminFeedbacksPage() {
    const { data: feedbacks, error } = await getFeedbacks()

    if (error) {
        return <div className="p-6 text-red-500">Error loading feedbacks: {error}</div>
    }

    return (
        <div className="p-6 max-w-[1600px] mx-auto w-full">
            <FeedbacksManager feedbacks={feedbacks || []} />
        </div>
    )
}
