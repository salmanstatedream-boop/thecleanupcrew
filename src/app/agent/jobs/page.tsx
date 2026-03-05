import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-auth";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Clock } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    assigned: "bg-blue-500/10 text-blue-600",
    accepted: "bg-sky-500/10 text-sky-600",
    en_route: "bg-yellow-500/10 text-yellow-600",
    arrived: "bg-orange-500/10 text-orange-600",
    in_progress: "bg-purple-500/10 text-purple-600",
    completed: "bg-green-500/10 text-green-600",
    invoiced: "bg-emerald-500/10 text-emerald-600",
};

export default async function AgentJobsPage() {
    const sessionClient = await createSupabaseServerClient();
    const { data: { user } } = await sessionClient.auth.getUser();
    if (!user) return null;

    const supabase = createSupabaseAdminClient();
    const { data: member } = await supabase
        .from("team_members")
        .select("id, name")
        .eq("auth_user_id", user.id)
        .single();

    const { data: jobs } = member
        ? await supabase
            .from("assignments")
            .select(
                "id, status, scheduled_date, scheduled_window_start, priority, places(address, city)"
            )
            .eq("assigned_to", member.id)
            .order("scheduled_date", { ascending: false })
        : { data: [] };

    const allJobs = jobs ?? [];

    return (
        <div className="px-4 pt-6 space-y-5">
            <div>
                <h1 className="text-2xl font-semibold">All My Jobs</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    {allJobs.length} assignment{allJobs.length !== 1 ? "s" : ""}
                </p>
            </div>

            {allJobs.length === 0 ? (
                <p className="text-center text-muted-foreground py-16 text-sm">
                    No jobs assigned yet.
                </p>
            ) : (
                <div className="space-y-3">
                    {allJobs.map((job) => {
                        const place = (job.places as unknown) as { address: string; city: string } | null;
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
                                        <p className="text-xs text-muted-foreground">{place.city}</p>
                                    )}
                                    <div className="flex items-center gap-2 mt-1.5">
                                        {job.scheduled_date && (
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(job.scheduled_date + "T00:00:00").toLocaleDateString(
                                                    "en-CA",
                                                    { month: "short", day: "numeric" }
                                                )}
                                            </span>
                                        )}
                                        {job.scheduled_window_start && (
                                            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                                                <Clock size={10} />
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
