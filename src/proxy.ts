import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
    const { supabaseResponse, user, supabase } = await updateSession(request);
    const { pathname } = request.nextUrl;

    // If not logged in and hitting a protected route, redirect to /login
    if (!user) {
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/agent")) {
            const loginUrl = request.nextUrl.clone();
            loginUrl.pathname = "/login";
            loginUrl.searchParams.set("redirectTo", pathname);
            return NextResponse.redirect(loginUrl);
        }
        return supabaseResponse;
    }

    // Already logged in hitting /login — redirect to appropriate dashboard
    if (pathname === "/login") {
        const { data: member } = await supabase
            .from("team_members")
            .select("role")
            .eq("auth_user_id", user.id)
            .single();

        const role = member?.role ?? "admin";
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = role === "field_agent" ? "/agent" : "/dashboard";
        redirectUrl.search = "";
        return NextResponse.redirect(redirectUrl);
    }

    // Role-based redirect: field agents cannot access admin dashboard
    if (pathname.startsWith("/dashboard")) {
        const { data: member } = await supabase
            .from("team_members")
            .select("role")
            .eq("auth_user_id", user.id)
            .single();

        if (member?.role === "field_agent") {
            const agentUrl = request.nextUrl.clone();
            agentUrl.pathname = "/agent";
            return NextResponse.redirect(agentUrl);
        }
    }

    // Role-based redirect: non-agents accessing /agent go to dashboard
    if (pathname.startsWith("/agent")) {
        const { data: member } = await supabase
            .from("team_members")
            .select("role")
            .eq("auth_user_id", user.id)
            .single();

        if (member && member.role !== "field_agent") {
            const dashUrl = request.nextUrl.clone();
            dashUrl.pathname = "/dashboard";
            return NextResponse.redirect(dashUrl);
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
