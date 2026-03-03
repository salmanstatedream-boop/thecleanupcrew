import { createClient } from "@supabase/supabase-js";

// Server-side admin client — uses the service role key
// NEVER expose this client to the browser
export function createServerClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    return createClient(supabaseUrl, supabaseServiceKey);
}
