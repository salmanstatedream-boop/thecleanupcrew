import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AssignmentActions } from "@/components/dashboard/AssignmentActions";
import { ChevronLeft, Clock, MapPin, User } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    created: "bg-gray-500/10 text-gray-500",
    assigned: "bg-blue-500/10 text-blue-600",
    accepted: "bg-sky-500/10 text-sky-600",
    en_route: "bg-yellow-500/10 text-yellow-600",
    arrived: "bg-orange-500/10 text-orange-600",
    in_progress: "bg-purple-500/10 text-purple-600",
    completed: "bg-green-500/10 text-green-600",
    qa: "bg-teal-500/10 text-teal-600",
    invoiced: "bg-emerald-500/10 text-emerald-600",
};

async function getAssignment(id: string) {
    const supabase = createSupabaseAdminClient();
    const [assignmentRes, logRes, teamRes] = await Promise.all([
        supabase
            .from("assignments")
            .select(
                "*, team_members(id, name, role), places(id, address, city, province, access_instructions), leads(id, name, email, phone)"
            )
            .eq("id", id)
            .single(),
        supabase
            .from("assignment_status_log")
            .select("id, old_status, new_status, changed_at, notes, team_members(name)")
            .eq("assignment_id", id)
            .order("changed_at", { ascending: true }),
        supabase
            .from("team_members")
            .select("id, name")
            .eq("is_active", true)
            .in("role", ["field_agent", "dispatcher"]),
    ]);

    if (assignmentRes.error) return null;
    return {
        assignment: assignmentRes.data,
        statusLog: logRes.data ?? [],
        teamMembers: teamRes.data ?? [],
    };
}

export default async function AssignmentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await getAssignment(id);
    if (!result) notFound();

    const { assignment, statusLog, teamMembers } = result;
    const place = assignment.places as { address: string; city: string; province: string; access_instructions: string } | null;
    const lead = assignment.leads as { name: string; email: string; phone: string } | null;
    const assignee = assignment.team_members as { id: string; name: string } | null;

    return (
        <div className="p-6 space-y-6 max-w-4xl">
            <Link
                href="/dashboard/dispatch"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ChevronLeft size={16} />
                All Jobs
            </Link>

            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        {place?.address ?? "Assignment"}
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge
                            variant="outline"
                            className={STATUS_COLORS[assignment.status]}
                        >
                            {assignment.status.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground capitalize">
                            {assignment.priority} priority
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Details */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                            <Clock size={14} />
                            Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <div>
                            <span className="text-muted-foreground">Date: </span>
                            {assignment.scheduled_date
                                ? new Date(assignment.scheduled_date + "T00:00:00").toLocaleDateString("en-CA", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })
                                : "Not scheduled"}
                        </div>
                        {assignment.scheduled_window_start && (
                            <div>
                                <span className="text-muted-foreground">Window: </span>
                                {assignment.scheduled_window_start.slice(0, 5)}
                                {assignment.scheduled_window_end &&
                                    ` – ${assignment.scheduled_window_end.slice(0, 5)}`}
                            </div>
                        )}
                        {assignment.estimated_duration_minutes && (
                            <div>
                                <span className="text-muted-foreground">Est. Duration: </span>
                                {assignment.estimated_duration_minutes} min
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Location */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                            <MapPin size={14} />
                            Location
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        {place ? (
                            <>
                                <div>{place.address}</div>
                                {place.city && <div className="text-muted-foreground">{place.city}{place.province ? `, ${place.province}` : ""}</div>}
                                {place.access_instructions && (
                                    <div className="mt-2">
                                        <span className="text-muted-foreground block mb-0.5">Access:</span>
                                        {place.access_instructions}
                                    </div>
                                )}
                            </>
                        ) : (
                            <span className="text-muted-foreground">No location set</span>
                        )}
                    </CardContent>
                </Card>

                {/* Client */}
                {lead && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                                <User size={14} />
                                Client
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <div className="font-medium">{lead.name}</div>
                            {lead.email && <div className="text-muted-foreground">{lead.email}</div>}
                            {lead.phone && <div className="text-muted-foreground">{lead.phone}</div>}
                        </CardContent>
                    </Card>
                )}

                {/* Notes */}
                {assignment.notes && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground font-medium">Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm">{assignment.notes}</p>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Actions */}
            <AssignmentActions
                assignment={{
                    id: assignment.id,
                    status: assignment.status,
                    assigned_to: assignee?.id ?? null,
                }}
                teamMembers={teamMembers}
            />

            {/* Status Timeline */}
            {statusLog.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Status Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {statusLog.map((entry, i) => (
                                <div key={entry.id} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-border mt-1.5 shrink-0" />
                                        {i < statusLog.length - 1 && (
                                            <div className="w-px flex-1 bg-border mt-1" />
                                        )}
                                    </div>
                                    <div className="pb-3">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-medium capitalize">
                                                {entry.new_status.replace("_", " ")}
                                            </span>
                                            {entry.old_status && (
                                                <span className="text-xs text-muted-foreground">
                                                    from {entry.old_status.replace("_", " ")}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                            {new Date(entry.changed_at).toLocaleString("en-CA")}
                                            {(entry.team_members as unknown as { name: string } | null)?.name &&
                                                ` · ${(entry.team_members as unknown as { name: string }).name}`}
                                        </div>
                                        {entry.notes && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {entry.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
