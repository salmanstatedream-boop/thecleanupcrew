"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const supabase = createSupabaseBrowserClient();
        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        if (data.user) {
            const { data: member } = await supabase
                .from("team_members")
                .select("role")
                .eq("auth_user_id", data.user.id)
                .single();

            const destination =
                member?.role === "field_agent" ? "/agent" : redirectTo;
            router.push(destination);
            router.refresh();
        }
    }

    return (
        <Card className="w-full max-w-sm mx-4">
            <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                    <Image
                        src="/images/logo.png"
                        alt="The Cleanup Crew"
                        width={48}
                        height={48}
                        className="object-contain"
                    />
                </div>
                <h1 className="text-xl font-semibold">Staff Login</h1>
                <p className="text-sm text-muted-foreground">
                    The Cleanup Crew Operations
                </p>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@thecleanupcrew.ca"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Signing in…" : "Sign in"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
