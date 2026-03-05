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
import { CreateTeamMemberDialog } from "@/components/dashboard/CreateTeamMemberDialog";

const ROLE_COLORS: Record<string, string> = {
    admin: "bg-red-500/10 text-red-600 border-red-200",
    dispatcher: "bg-blue-500/10 text-blue-600 border-blue-200",
    manager: "bg-purple-500/10 text-purple-600 border-purple-200",
    field_agent: "bg-green-500/10 text-green-600 border-green-200",
};

async function getTeamMembers() {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
        .from("team_members")
        .select("id, name, email, phone, role, region, pay_type, is_active, created_at")
        .order("name");
    return data ?? [];
}

export default async function TeamPage() {
    const members = await getTeamMembers();
    const active = members.filter((m) => m.is_active);
    const inactive = members.filter((m) => !m.is_active);

    return (
        <div className="p-6 space-y-6 max-w-7xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Team</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {active.length} active member{active.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <CreateTeamMemberDialog />
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead>Pay Type</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-12 text-muted-foreground"
                                >
                                    No team members yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            members.map((member) => (
                                <TableRow
                                    key={member.id}
                                    className={`cursor-pointer hover:bg-muted/40 ${
                                        !member.is_active ? "opacity-50" : ""
                                    }`}
                                >
                                    <TableCell>
                                        <Link
                                            href={`/dashboard/team/${member.id}`}
                                            className="font-medium hover:underline"
                                        >
                                            {member.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        <div>{member.email}</div>
                                        <div>{member.phone ?? ""}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={ROLE_COLORS[member.role]}
                                        >
                                            {member.role.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {member.region ?? "—"}
                                    </TableCell>
                                    <TableCell className="text-sm capitalize text-muted-foreground">
                                        {member.pay_type ?? "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={member.is_active ? "text-green-600" : "text-gray-400"}>
                                            {member.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {inactive.length > 0 && (
                <p className="text-xs text-muted-foreground">
                    {inactive.length} inactive member{inactive.length !== 1 ? "s" : ""} hidden above.
                </p>
            )}
        </div>
    );
}
