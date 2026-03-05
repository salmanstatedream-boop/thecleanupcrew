import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const supabase = createSupabaseAdminClient();
    let query = supabase
        .from("assignments")
        .select(
            "id, status, scheduled_date, scheduled_window_start, scheduled_window_end, priority, estimated_duration_minutes, notes, created_at, completed_at, assigned_to, lead_id, place_id, team_members(name), places(address, city)"
        )
        .order("scheduled_date", { ascending: true, nullsFirst: false });

    if (status && status !== "all") {
        query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const {
        lead_id,
        place_id,
        assigned_to,
        scheduled_date,
        scheduled_window_start,
        scheduled_window_end,
        priority,
        estimated_duration_minutes,
        notes,
    } = body;

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from("assignments")
        .insert({
            lead_id,
            place_id,
            assigned_to,
            status: assigned_to ? "assigned" : "created",
            scheduled_date,
            scheduled_window_start,
            scheduled_window_end,
            priority: priority ?? "normal",
            estimated_duration_minutes,
            notes,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log initial status
    if (data) {
        await supabase.from("assignment_status_log").insert({
            assignment_id: data.id,
            old_status: null,
            new_status: data.status,
            notes: "Assignment created",
        });
    }

    return NextResponse.json(data, { status: 201 });
}
