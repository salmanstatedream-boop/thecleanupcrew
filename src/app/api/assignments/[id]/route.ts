import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = createSupabaseAdminClient();

    const [assignmentRes, logRes] = await Promise.all([
        supabase
            .from("assignments")
            .select(
                "*, team_members(id, name, role), places(id, address, city, province, access_instructions), leads(id, name, email, phone)"
            )
            .eq("id", id)
            .single(),
        supabase
            .from("assignment_status_log")
            .select("*, team_members(name)")
            .eq("assignment_id", id)
            .order("changed_at", { ascending: true }),
    ]);

    if (assignmentRes.error) {
        return NextResponse.json({ error: assignmentRes.error.message }, { status: 404 });
    }

    return NextResponse.json({
        assignment: assignmentRes.data,
        statusLog: logRes.data ?? [],
    });
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const { new_status, changed_by, log_notes, ...rest } = body;

    const supabase = createSupabaseAdminClient();

    // Fetch current status for audit log
    if (new_status) {
        const { data: current } = await supabase
            .from("assignments")
            .select("status")
            .eq("id", id)
            .single();

        const updatePayload: Record<string, unknown> = {
            ...rest,
            status: new_status,
        };
        if (new_status === "completed") {
            updatePayload.completed_at = new Date().toISOString();
        }

        const { data, error } = await supabase
            .from("assignments")
            .update(updatePayload)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Write to immutable status log
        await supabase.from("assignment_status_log").insert({
            assignment_id: id,
            old_status: current?.status ?? null,
            new_status,
            changed_by: changed_by ?? null,
            notes: log_notes ?? null,
        });

        return NextResponse.json(data);
    }

    // General field update (no status change)
    const { data, error } = await supabase
        .from("assignments")
        .update(rest)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}
