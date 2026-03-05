import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AgentProfilePage() {
    const sessionClient = await createSupabaseServerClient();
    const { data: { user } } = await sessionClient.auth.getUser();
    if (!user) return null;

    const supabase = createSupabaseAdminClient();
    const { data: member } = await supabase
        .from("team_members")
        .select("name, email, phone, role, region, pay_type, created_at")
        .eq("auth_user_id", user.id)
        .single();

    return (
        <div className="px-4 pt-6 space-y-5">
            <h1 className="text-2xl font-semibold">My Profile</h1>

            {member ? (
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{member.name}</CardTitle>
                            <Badge variant="outline" className="capitalize text-xs">
                                {member.role.replace("_", " ")}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Email</span>
                            <span>{member.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone</span>
                            <span>{member.phone ?? "—"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Region</span>
                            <span>{member.region ?? "—"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Pay Type</span>
                            <span className="capitalize">{member.pay_type ?? "—"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Member Since</span>
                            <span>
                                {new Date(member.created_at).toLocaleDateString("en-CA", {
                                    year: "numeric",
                                    month: "short",
                                })}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <p className="text-muted-foreground text-sm">
                    Profile not found. Please contact your administrator.
                </p>
            )}
        </div>
    );
}
