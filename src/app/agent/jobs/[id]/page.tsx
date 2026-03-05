import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentStatusActions } from "@/components/agent/AgentStatusActions";
import { ChevronLeft, MapPin, Clock, User } from "lucide-react";

type PlaceData = { address: string; city: string; province: string; access_instructions: string; hazards: string };
type LeadData = { name: string; phone: string };

const STATUS_COLORS: Record<string, string> = {
    assigned: "bg-blue-500/10 text-blue-600",
    accepted: "bg-sky-500/10 text-sky-600",
    en_route: "bg-yellow-500/10 text-yellow-600",
    arrived: "bg-orange-500/10 text-orange-600",
    in_progress: "bg-purple-500/10 text-purple-600",
    completed: "bg-green-500/10 text-green-600",
};

async function getJob(id: string) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("assignments")
        .select(
            "id, status, scheduled_date, scheduled_window_start, scheduled_window_end, estimated_duration_minutes, notes, priority, assigned_to, places(address, city, province, access_instructions, hazards), leads(name, phone)"
        )
        .eq("id", id)
        .single();
    if (error) return null;
    return data;
}

export default async function AgentJobDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const sessionClient = await createSupabaseServerClient();
    const { data: { user } } = await sessionClient.auth.getUser();
    if (!user) notFound();

    const adminClient = createSupabaseAdminClient();
    const { data: member } = await adminClient
        .from("team_members")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

    const job = await getJob(id);
    if (!job) notFound();

    if (member && job.assigned_to !== member.id) notFound();

    const place = (job.places as unknown) as PlaceData | null;
    const lead = (job.leads as unknown) as LeadData | null;

    return (
        <div className="px-4 pt-6 space-y-5">
            <Link
                href="/agent"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground"
            >
                <ChevronLeft size={16} />
                Back
            </Link>

            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Badge
                        variant="outline"
                        className={STATUS_COLORS[job.status] ?? ""}
                    >
                        {job.status.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-muted-foreground capitalize">
                        {job.priority} priority
                    </span>
                </div>
                <h1 className="text-xl font-semibold">
                    {place?.address ?? "Job Detail"}
                </h1>
                {place?.city && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {place.city}{place.province ? `, ${place.province}` : ""}
                    </p>
                )}
            </div>

            {/* Status Actions */}
            {job.status !== "completed" && (
                <AgentStatusActions
                    jobId={job.id}
                    currentStatus={job.status}
                    teamMemberId={member?.id ?? ""}
                />
            )}

            {/* Schedule */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                        <Clock size={14} />
                        Schedule
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1.5">
                    {job.scheduled_date && (
                        <div>
                            {new Date(job.scheduled_date + "T00:00:00").toLocaleDateString("en-CA", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    )}
                    {job.scheduled_window_start && (
                        <div className="text-muted-foreground">
                            {job.scheduled_window_start.slice(0, 5)}
                            {job.scheduled_window_end && ` – ${job.scheduled_window_end.slice(0, 5)}`}
                        </div>
                    )}
                    {job.estimated_duration_minutes && (
                        <div className="text-muted-foreground">
                            Est. {job.estimated_duration_minutes} min
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Location */}
            {place && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                            <MapPin size={14} />
                            Location
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <div className="font-medium">{place.address}</div>
                        {place.access_instructions && (
                            <div>
                                <span className="text-muted-foreground text-xs block mb-0.5">
                                    Access Instructions
                                </span>
                                <p>{place.access_instructions}</p>
                            </div>
                        )}
                        {place.hazards && (
                            <div className="bg-yellow-500/10 border border-yellow-200 rounded-lg p-3">
                                <span className="text-yellow-700 text-xs font-semibold block mb-0.5">
                                    HAZARDS
                                </span>
                                <p className="text-sm text-yellow-800">{place.hazards}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Client */}
            {lead && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                            <User size={14} />
                            Client
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1.5">
                        <div className="font-medium">{lead.name}</div>
                        {lead.phone && (
                            <a href={`tel:${lead.phone}`} className="text-primary text-sm">
                                {lead.phone}
                            </a>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Notes */}
            {job.notes && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground font-medium">
                            Notes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{job.notes}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
