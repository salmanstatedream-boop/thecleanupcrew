"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Lead = {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    status: string;
    source: string | null;
    notes: string | null;
    assigned_to: string | null;
};

type TeamMember = { id: string; name: string; role: string };

export function LeadActions({
    lead,
    teamMembers,
}: {
    lead: Lead;
    teamMembers: TeamMember[];
}) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(lead.status);
    const [assignedTo, setAssignedTo] = useState(lead.assigned_to ?? "unassigned");
    const [notes, setNotes] = useState(lead.notes ?? "");

    async function handleSave() {
        setSaving(true);
        const res = await fetch(`/api/leads/${lead.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status,
                assigned_to: assignedTo === "unassigned" ? null : assignedTo,
                notes,
            }),
        });

        if (res.ok) {
            toast.success("Lead updated");
            router.refresh();
        } else {
            const { error } = await res.json();
            toast.error(error ?? "Failed to update lead");
        }
        setSaving(false);
    }

    async function handleDelete() {
        if (!confirm(`Delete lead "${lead.name}"? This cannot be undone.`)) return;
        const res = await fetch(`/api/leads/${lead.id}`, { method: "DELETE" });
        if (res.ok) {
            toast.success("Lead deleted");
            router.push("/dashboard/leads");
        } else {
            toast.error("Failed to delete lead");
        }
    }

    return (
        <div className="w-full max-w-sm space-y-4 p-4 border border-border rounded-lg bg-card">
            <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="quoted">Quoted</SelectItem>
                        <SelectItem value="booked">Booked</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1.5">
                <Label>Assign To</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                    <SelectTrigger>
                        <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {teamMembers.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                                {m.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1.5">
                <Label>Notes</Label>
                <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes…"
                />
            </div>

            <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                    {saving ? "Saving…" : "Save Changes"}
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    className="shrink-0"
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}
