import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET() {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("team_members")
        .select("id, name, email, phone, role, region, pay_type, is_active, created_at")
        .order("name");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { name, email, phone, role, region, pay_type } = body;

    if (!name || !email || !role) {
        return NextResponse.json(
            { error: "Name, email, and role are required" },
            { status: 400 }
        );
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("team_members")
        .insert({ name, email, phone, role, region, pay_type })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
}
