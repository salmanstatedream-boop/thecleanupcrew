import { createSupabaseServerClient } from "@/lib/supabase/server-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Calendar, Clock } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    assigned: "bg-blue-500/10 text-blue-600",
    accepted: "bg-sky-500/10 text-sky-600",
    en_route: "bg-yellow-500/10 text-yellow-600",
    arrived: "bg-orange-500/10 text-orange-600",
    in_progress: "bg-purple-500/10 text-purple-600",
    completed: "bg-green-500/10 text-green-600",
};

async function getTodayJobs(teamMemberId: string) {
    const supabase = createSupabaseAdminClient();
    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
        .from("assignments")
        .select(
            "id, status, scheduled_date, scheduled_window_start, scheduled_window_end, priority, notes, places(address, city), leads(name)"
        )
        .eq("assigned_to", teamMemberId)
        .eq("scheduled_date", today)
        .not("status", "in", '("completed","invoiced")')
        .order("scheduled_window_start");

    return data ?? [];
}

export default async function AgentHomePage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const adminClient = createSupabaseAdminClient();
    const { data: member } = await adminClient
        .from("team_members")
        .select("id, name")
        .eq("auth_user_id", user.id)
        .single();

    const todayJobs = member ? await getTodayJobs(member.id) : [];
    const today = new Date().toLocaleDateString("en-CA", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="px-4 pt-6 space-y-6">
            {/* Header */}
            <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Calendar size={12} />
                    {today}
                </p>
                <h1 className="text-2xl font-semibold mt-1">
                    Good {getTimeOfDay()}, {member?.name?.split(" ")[0] ?? "there"}
                </h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                    {todayJobs.length === 0
                        ? "No jobs scheduled for today."
                        : `${todayJobs.length} job${todayJobs.length !== 1 ? "s" : ""} today`}
                </p>
            </div>

            {/* Today's Jobs */}
            {todayJobs.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-sm font-medium text-muted-foreground">Today&apos;s Jobs</h2>
                    {todayJobs.map((job) => {
                        const place = (job.places as unknown) as { address: string; city: string } | null;
                        const lead = (job.leads as unknown) as { name: string } | null;
                        return (
                            <Link
                                key={job.id}
                                href={`/agent/jobs/${job.id}`}
                                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                        {place?.address ?? "Job"}
                                    </p>
                                    {place?.city && (
                                        <p className="text-xs text-muted-foreground truncate">
                                            {place.city}
                                        </p>
                                    )}
                                    {lead?.name && (
                                        <p className="text-xs text-muted-foreground truncate">
                                            {lead.name}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-2">
                                        {job.scheduled_window_start && (
                                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock size={11} />
                                                {job.scheduled_window_start.slice(0, 5)}
                                            </span>
                                        )}
                                        <Badge
                                            variant="outline"
                                            className={`text-[10px] py-0 ${STATUS_COLORS[job.status] ?? ""}`}
                                        >
                                            {job.status.replace("_", " ")}
                                        </Badge>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-muted-foreground shrink-0" />
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
}
