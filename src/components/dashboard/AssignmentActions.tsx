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

const STATUS_FLOW = [
    "created", "assigned", "accepted", "en_route", "arrived",
    "in_progress", "completed", "qa", "invoiced",
];

type Assignment = {
    id: string;
    status: string;
    assigned_to: string | null;
};

type TeamMember = { id: string; name: string };

export function AssignmentActions({
    assignment,
    teamMembers,
}: {
    assignment: Assignment;
    teamMembers: TeamMember[];
}) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(assignment.status);
    const [assignedTo, setAssignedTo] = useState(assignment.assigned_to ?? "unassigned");
    const [notes, setNotes] = useState("");

    const currentIndex = STATUS_FLOW.indexOf(assignment.status);
    const nextStatus = STATUS_FLOW[currentIndex + 1];

    async function handleStatusChange(newStatus: string) {
        setSaving(true);
        const res = await fetch(`/api/assignments/${assignment.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                new_status: newStatus,
                log_notes: notes || null,
            }),
        });

        if (res.ok) {
            toast.success(`Status updated to "${newStatus.replace("_", " ")}"`);
            setStatus(newStatus);
            setNotes("");
            router.refresh();
        } else {
            const { error } = await res.json();
            toast.error(error ?? "Failed to update status");
        }
        setSaving(false);
    }

    async function handleReassign() {
        if (assignedTo === (assignment.assigned_to ?? "unassigned")) return;
        setSaving(true);
        const res = await fetch(`/api/assignments/${assignment.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                assigned_to: assignedTo === "unassigned" ? null : assignedTo,
                new_status: assignedTo === "unassigned" ? "created" : "assigned",
                log_notes: `Reassigned to ${teamMembers.find((m) => m.id === assignedTo)?.name ?? "nobody"}`,
            }),
        });

        if (res.ok) {
            toast.success("Assignment reassigned");
            router.refresh();
        } else {
            toast.error("Failed to reassign");
        }
        setSaving(false);
    }

    return (
        <div className="p-4 border border-border rounded-lg bg-card space-y-4">
            <h3 className="text-sm font-medium">Manage Assignment</h3>

            {/* Quick advance */}
            {nextStatus && (
                <div className="space-y-2">
                    <Label>Quick advance</Label>
                    <div className="flex gap-2">
                        <Input
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Optional note for this status change…"
                            className="flex-1"
                        />
                        <Button
                            onClick={() => handleStatusChange(nextStatus)}
                            disabled={saving}
                            className="shrink-0"
                        >
                            → {nextStatus.replace("_", " ")}
                        </Button>
                    </div>
                </div>
            )}

            {/* Manual status */}
            <div className="space-y-1.5">
                <Label>Set Status Manually</Label>
                <div className="flex gap-2">
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="flex-1">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {STATUS_FLOW.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {s.replace("_", " ")}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        onClick={() => handleStatusChange(status)}
                        disabled={saving || status === assignment.status}
                        className="shrink-0"
                    >
                        Apply
                    </Button>
                </div>
            </div>

            {/* Reassign */}
            <div className="space-y-1.5">
                <Label>Reassign To</Label>
                <div className="flex gap-2">
                    <Select value={assignedTo} onValueChange={setAssignedTo}>
                        <SelectTrigger className="flex-1">
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
                    <Button
                        variant="outline"
                        onClick={handleReassign}
                        disabled={saving}
                        className="shrink-0"
                    >
                        Reassign
                    </Button>
                </div>
            </div>
        </div>
    );
}
