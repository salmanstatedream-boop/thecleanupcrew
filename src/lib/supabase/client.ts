import { createClient } from "@supabase/supabase-js";

// Browser (public) client — safe for client components
// Uses NEXT_PUBLIC_ env vars which are inlined at build time
export function createBrowserClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createClient(supabaseUrl, supabaseAnonKey);
}
