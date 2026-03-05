"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Lead = { id: string; name: string };
type TeamMember = { id: string; name: string };

export function CreateAssignmentDialog({
    leads,
    teamMembers,
}: {
    leads: Lead[];
    teamMembers: TeamMember[];
}) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        lead_id: "",
        assigned_to: "",
        scheduled_date: "",
        scheduled_window_start: "",
        scheduled_window_end: "",
        priority: "normal",
        estimated_duration_minutes: "",
        notes: "",
    });

    function update(field: string, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const payload = {
            ...form,
            lead_id: form.lead_id || null,
            assigned_to: form.assigned_to || null,
            estimated_duration_minutes: form.estimated_duration_minutes
                ? parseInt(form.estimated_duration_minutes)
                : null,
            scheduled_window_start: form.scheduled_window_start || null,
            scheduled_window_end: form.scheduled_window_end || null,
        };

        const res = await fetch("/api/assignments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            toast.success("Assignment created");
            setOpen(false);
            setForm({
                lead_id: "",
                assigned_to: "",
                scheduled_date: "",
                scheduled_window_start: "",
                scheduled_window_end: "",
                priority: "normal",
                estimated_duration_minutes: "",
                notes: "",
            });
            router.refresh();
        } else {
            const { error } = await res.json();
            toast.error(error ?? "Failed to create assignment");
        }
        setSaving(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5">
                    <Plus size={16} />
                    New Job
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Assignment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Lead</Label>
                            <Select value={form.lead_id} onValueChange={(v) => update("lead_id", v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select lead…" />
                                </SelectTrigger>
                                <SelectContent>
                                    {leads.map((l) => (
                                        <SelectItem key={l.id} value={l.id}>
                                            {l.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>Assign To</Label>
                            <Select value={form.assigned_to} onValueChange={(v) => update("assigned_to", v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Unassigned" />
                                </SelectTrigger>
                                <SelectContent>
                                    {teamMembers.map((m) => (
                                        <SelectItem key={m.id} value={m.id}>
                                            {m.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="asgn-date">Scheduled Date</Label>
                        <Input
                            id="asgn-date"
                            type="date"
                            value={form.scheduled_date}
                            onChange={(e) => update("scheduled_date", e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="asgn-start">Window Start</Label>
                            <Input
                                id="asgn-start"
                                type="time"
                                value={form.scheduled_window_start}
                                onChange={(e) => update("scheduled_window_start", e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="asgn-end">Window End</Label>
                            <Input
                                id="asgn-end"
                                type="time"
                                value={form.scheduled_window_end}
                                onChange={(e) => update("scheduled_window_end", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Priority</Label>
                            <Select value={form.priority} onValueChange={(v) => update("priority", v)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="asgn-duration">Est. Duration (min)</Label>
                            <Input
                                id="asgn-duration"
                                type="number"
                                min="15"
                                step="15"
                                value={form.estimated_duration_minutes}
                                onChange={(e) => update("estimated_duration_minutes", e.target.value)}
                                placeholder="120"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="asgn-notes">Notes</Label>
                        <Input
                            id="asgn-notes"
                            value={form.notes}
                            onChange={(e) => update("notes", e.target.value)}
                            placeholder="Special instructions…"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? "Creating…" : "Create Job"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
