import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CreateAssignmentDialog } from "@/components/dashboard/CreateAssignmentDialog";

const STATUS_COLORS: Record<string, string> = {
    created: "bg-gray-500/10 text-gray-500 border-gray-200",
    assigned: "bg-blue-500/10 text-blue-600 border-blue-200",
    accepted: "bg-sky-500/10 text-sky-600 border-sky-200",
    en_route: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
    arrived: "bg-orange-500/10 text-orange-600 border-orange-200",
    in_progress: "bg-purple-500/10 text-purple-600 border-purple-200",
    completed: "bg-green-500/10 text-green-600 border-green-200",
    qa: "bg-teal-500/10 text-teal-600 border-teal-200",
    invoiced: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
};

const PRIORITY_COLORS: Record<string, string> = {
    low: "text-gray-400",
    normal: "text-foreground",
    high: "text-orange-500",
    urgent: "text-red-500 font-semibold",
};

async function getAssignments(status?: string) {
    const supabase = createSupabaseAdminClient();
    let query = supabase
        .from("assignments")
        .select(
            "id, status, scheduled_date, scheduled_window_start, priority, notes, team_members(name), places(address, city), leads(name)"
        )
        .order("scheduled_date", { ascending: true, nullsFirst: false });

    if (status && status !== "all") {
        query = query.eq("status", status);
    }

    const { data } = await query;
    return data ?? [];
}

async function getLeadsAndTeam() {
    const supabase = createSupabaseAdminClient();
    const [leadsRes, teamRes] = await Promise.all([
        supabase.from("leads").select("id, name").eq("status", "booked"),
        supabase
            .from("team_members")
            .select("id, name")
            .eq("is_active", true)
            .in("role", ["field_agent", "dispatcher"]),
    ]);
    return { leads: leadsRes.data ?? [], teamMembers: teamRes.data ?? [] };
}

const STATUSES = [
    "all", "created", "assigned", "accepted", "en_route",
    "arrived", "in_progress", "completed", "qa", "invoiced",
];

export default async function DispatchPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const { status = "all" } = await searchParams;
    const [assignments, { leads, teamMembers }] = await Promise.all([
        getAssignments(status),
        getLeadsAndTeam(),
    ]);

    return (
        <div className="p-6 space-y-6 max-w-7xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Dispatch</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {assignments.length} job{assignments.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <CreateAssignmentDialog leads={leads} teamMembers={teamMembers} />
            </div>

            {/* Status filter */}
            <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                    <Link
                        key={s}
                        href={`/dashboard/dispatch?status=${s}`}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize border transition-colors ${
                            status === s
                                ? "bg-foreground text-background border-foreground"
                                : "border-border text-muted-foreground hover:border-foreground/30"
                        }`}
                    >
                        {s.replace("_", " ")}
                    </Link>
                ))}
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Lead / Client</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assignments.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-12 text-muted-foreground"
                                >
                                    No assignments found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            assignments.map((a) => (
                                <TableRow key={a.id} className="cursor-pointer hover:bg-muted/40">
                                    <TableCell className="text-sm">
                                        <Link
                                            href={`/dashboard/dispatch/${a.id}`}
                                            className="hover:underline font-medium"
                                        >
                                            {a.scheduled_date
                                                ? new Date(a.scheduled_date + "T00:00:00").toLocaleDateString("en-CA", {
                                                    month: "short",
                                                    day: "numeric",
                                                })
                                                : "No date"}
                                        </Link>
                                        {a.scheduled_window_start && (
                                            <div className="text-xs text-muted-foreground">
                                                {a.scheduled_window_start.slice(0, 5)}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {((a.leads as unknown) as { name: string } | null)?.name ?? "—"}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {((a.places as unknown) as { address: string; city: string } | null)
                                            ? `${((a.places as unknown) as { address: string; city: string }).address}, ${((a.places as unknown) as { address: string; city: string }).city ?? ""}`
                                            : "—"}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {((a.team_members as unknown) as { name: string } | null)?.name ?? (
                                            <span className="text-muted-foreground">Unassigned</span>
                                        )}
                                    </TableCell>
                                    <TableCell className={`text-sm capitalize ${PRIORITY_COLORS[a.priority]}`}>
                                        {a.priority}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={STATUS_COLORS[a.status]}
                                        >
                                            {a.status.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
