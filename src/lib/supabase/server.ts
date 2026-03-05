import { createClient } from "@supabase/supabase-js";

// Admin client — uses the service role key, bypasses RLS
// NEVER expose this client to the browser. Use only in API route handlers.
export function createSupabaseAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}
