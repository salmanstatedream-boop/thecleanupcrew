"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
    LayoutDashboard,
    Users,
    Truck,
    FileText,
    LogOut,
    UserCircle,
    ChevronLeft,
    ChevronRight,
    MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/leads", label: "Leads", icon: UserCircle },
    { href: "/dashboard/team", label: "Team", icon: Users },
    { href: "/dashboard/dispatch", label: "Dispatch", icon: Truck },
    { href: "/dashboard/places", label: "Places", icon: MapPin },
    { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [signingOut, setSigningOut] = useState(false);

    async function handleSignOut() {
        setSigningOut(true);
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    }

    return (
        <aside
            className={cn(
                "flex flex-col h-screen bg-card border-r border-border transition-all duration-200 shrink-0",
                collapsed ? "w-16" : "w-60"
            )}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border min-h-[64px]">
                <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="shrink-0 object-contain"
                />
                {!collapsed && (
                    <span className="font-semibold text-sm leading-tight text-foreground">
                        The Cleanup Crew
                    </span>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 overflow-y-auto">
                <ul className="space-y-1 px-2">
                    {navItems.map(({ href, label, icon: Icon, exact }) => {
                        const active = exact
                            ? pathname === href
                            : pathname.startsWith(href);
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        active
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )}
                                    title={collapsed ? label : undefined}
                                >
                                    <Icon size={18} className="shrink-0" />
                                    {!collapsed && <span>{label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="border-t border-border p-2 space-y-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-3 text-muted-foreground"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    title={collapsed ? "Sign out" : undefined}
                >
                    <LogOut size={18} className="shrink-0" />
                    {!collapsed && <span>{signingOut ? "Signing out…" : "Sign out"}</span>}
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center text-muted-foreground"
                    onClick={() => setCollapsed(!collapsed)}
                    title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </Button>
            </div>
        </aside>
    );
}
