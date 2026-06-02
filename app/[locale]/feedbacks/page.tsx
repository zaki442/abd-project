import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FeedbackForm } from "@/components/feedback-form"

export default function FeedbacksPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />
            
            <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-24 px-4 bg-zinc-950 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]"></div>
                </div>

                <div className="relative z-10 w-full">
                    <FeedbackForm />
                </div>
            </div>

            <Footer />
        </main>
    )
}
