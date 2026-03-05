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
import { CreateLeadDialog } from "@/components/dashboard/CreateLeadDialog";

const STATUS_COLORS: Record<string, string> = {
    new: "bg-blue-500/10 text-blue-600 border-blue-200",
    contacted: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
    quoted: "bg-purple-500/10 text-purple-600 border-purple-200",
    booked: "bg-green-500/10 text-green-600 border-green-200",
    lost: "bg-red-500/10 text-red-600 border-red-200",
    cancelled: "bg-gray-500/10 text-gray-500 border-gray-200",
};

async function getLeads(status?: string) {
    const supabase = createSupabaseAdminClient();
    let query = supabase
        .from("leads")
        .select("id, name, email, phone, status, source, created_at, team_members(name)")
        .order("created_at", { ascending: false });

    if (status && status !== "all") {
        query = query.eq("status", status);
    }

    const { data } = await query;
    return data ?? [];
}

const STATUSES = ["all", "new", "contacted", "quoted", "booked", "lost", "cancelled"];

export default async function LeadsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const { status = "all" } = await searchParams;
    const leads = await getLeads(status);

    return (
        <div className="p-6 space-y-6 max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Leads</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {leads.length} lead{leads.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <CreateLeadDialog />
            </div>

            {/* Status filter tabs */}
            <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                    <Link
                        key={s}
                        href={`/dashboard/leads?status=${s}`}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize border transition-colors ${
                            status === s
                                ? "bg-foreground text-background border-foreground"
                                : "border-border text-muted-foreground hover:border-foreground/30"
                        }`}
                    >
                        {s}
                    </Link>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leads.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-12 text-muted-foreground"
                                >
                                    No leads found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            leads.map((lead) => (
                                <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/40">
                                    <TableCell>
                                        <Link
                                            href={`/dashboard/leads/${lead.id}`}
                                            className="font-medium hover:underline"
                                        >
                                            {lead.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        <div>{lead.email ?? "—"}</div>
                                        <div>{lead.phone ?? ""}</div>
                                    </TableCell>
                                    <TableCell className="text-sm capitalize text-muted-foreground">
                                        {lead.source ?? "manual"}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {((lead.team_members as unknown) as { name: string } | null)?.name ?? "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={STATUS_COLORS[lead.status]}
                                        >
                                            {lead.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {new Date(lead.created_at).toLocaleDateString("en-CA")}
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
