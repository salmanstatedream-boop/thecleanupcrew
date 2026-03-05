import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { TeamMemberActions } from "@/components/dashboard/TeamMemberActions";

const ROLE_COLORS: Record<string, string> = {
    admin: "bg-red-500/10 text-red-600",
    dispatcher: "bg-blue-500/10 text-blue-600",
    manager: "bg-purple-500/10 text-purple-600",
    field_agent: "bg-green-500/10 text-green-600",
};

async function getMember(id: string) {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("id", id)
        .single();
    if (error) return null;
    return data;
}

export default async function TeamMemberDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const member = await getMember(id);
    if (!member) notFound();

    return (
        <div className="p-6 space-y-6 max-w-3xl">
            <Link
                href="/dashboard/team"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ChevronLeft size={16} />
                All Team Members
            </Link>

            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">{member.name}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge
                            variant="outline"
                            className={ROLE_COLORS[member.role]}
                        >
                            {member.role.replace("_", " ")}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={member.is_active ? "text-green-600" : "text-gray-400"}
                        >
                            {member.is_active ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                </div>
            </div>

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
                            <a href={`mailto:${member.email}`} className="hover:underline">
                                {member.email}
                            </a>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Phone: </span>
                            {member.phone ? (
                                <a href={`tel:${member.phone}`} className="hover:underline">
                                    {member.phone}
                                </a>
                            ) : (
                                "—"
                            )}
                        </div>
                        <div>
                            <span className="text-muted-foreground">Region: </span>
                            {member.region ?? "—"}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground font-medium">
                            Employment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div>
                            <span className="text-muted-foreground">Pay Type: </span>
                            <span className="capitalize">{member.pay_type ?? "—"}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Member Since: </span>
                            {new Date(member.created_at).toLocaleDateString("en-CA", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <TeamMemberActions member={member} />
        </div>
    );
}
