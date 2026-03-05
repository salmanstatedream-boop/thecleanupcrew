import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadActions } from "@/components/dashboard/LeadActions";
import { ChevronLeft } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    new: "bg-blue-500/10 text-blue-600",
    contacted: "bg-yellow-500/10 text-yellow-600",
    quoted: "bg-purple-500/10 text-purple-600",
    booked: "bg-green-500/10 text-green-600",
    lost: "bg-red-500/10 text-red-600",
    cancelled: "bg-gray-500/10 text-gray-500",
};

async function getLead(id: string) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("leads")
        .select("*, team_members(id, name, role)")
        .eq("id", id)
        .single();
    if (error) return null;
    return data;
}

async function getTeamMembers() {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
        .from("team_members")
        .select("id, name, role")
        .eq("is_active", true)
        .order("name");
    return data ?? [];
}

export default async function LeadDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [lead, teamMembers] = await Promise.all([getLead(id), getTeamMembers()]);

    if (!lead) notFound();

    return (
        <div className="p-6 space-y-6 max-w-3xl">
            {/* Back */}
            <Link
                href="/dashboard/leads"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ChevronLeft size={16} />
                All Leads
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">{lead.name}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge
                            variant="outline"
                            className={STATUS_COLORS[lead.status]}
                        >
                            {lead.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            Created{" "}
                            {new Date(lead.created_at).toLocaleDateString("en-CA", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                </div>
                <LeadActions lead={lead} teamMembers={teamMembers} />
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground font-medium">
                            Contact Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div>
                            <span className="text-muted-foreground">Email: </span>
                            {lead.email ? (
                                <a
                                    href={`mailto:${lead.email}`}
                                    className="hover:underline"
                                >
                                    {lead.email}
                                </a>
                            ) : (
                                "—"
                            )}
                        </div>
                        <div>
                            <span className="text-muted-foreground">Phone: </span>
                            {lead.phone ? (
                                <a href={`tel:${lead.phone}`} className="hover:underline">
                                    {lead.phone}
                                </a>
                            ) : (
                                "—"
                            )}
                        </div>
                        <div>
                            <span className="text-muted-foreground">Source: </span>
                            <span className="capitalize">{lead.source ?? "manual"}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground font-medium">
                            Assignment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <div>
                            <span className="text-muted-foreground">Assigned to: </span>
                            {((lead.team_members as unknown) as { name: string } | null)?.name ?? "Unassigned"}
                        </div>
                        {lead.notes && (
                            <div>
                                <span className="text-muted-foreground block mb-1">Notes:</span>
                                <p className="text-foreground">{lead.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
