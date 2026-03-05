import { AgentBottomNav } from "@/components/agent/AgentBottomNav";
import { Toaster } from "@/components/ui/sonner";

export const dynamic = "force-dynamic";

export default function AgentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            {/* Content with bottom padding for nav */}
            <div className="pb-20 max-w-lg mx-auto">
                {children}
            </div>
            <AgentBottomNav />
            <Toaster richColors position="top-center" />
        </div>
    );
}
