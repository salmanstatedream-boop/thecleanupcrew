import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, subject, message } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Name, email, and message are required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        // Insert into Supabase
        const supabase = createServerClient();
        const { error } = await supabase.from("contact_submissions").insert({
            first_name: name,
            email,
            phone,
            service_interest: subject,
            message,
        });

        if (error) {
            console.error("Supabase insert error:", error);
            throw error;
        }

        return NextResponse.json(
            { success: true, message: "Form submitted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
