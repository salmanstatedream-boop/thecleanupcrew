"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const STATUS_FLOW = [
    "assigned",
    "accepted",
    "en_route",
    "arrived",
    "in_progress",
    "completed",
];

const STATUS_LABELS: Record<string, string> = {
    assigned: "Accept Job",
    accepted: "Mark En Route",
    en_route: "Mark Arrived",
    arrived: "Start Job",
    in_progress: "Mark Complete",
};

const STATUS_DESCRIPTIONS: Record<string, string> = {
    assigned: "Confirm you've received and accepted this job",
    accepted: "Let the admin know you're on your way",
    en_route: "You've arrived at the location",
    arrived: "Begin the job",
    in_progress: "Job finished — great work!",
};

export function AgentStatusActions({
    jobId,
    currentStatus,
    teamMemberId,
}: {
    jobId: string;
    currentStatus: string;
    teamMemberId: string;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    const nextStatus = STATUS_FLOW[currentIndex + 1];

    if (!nextStatus || currentStatus === "completed") return null;

    async function handleAdvance() {
        setLoading(true);
        const res = await fetch(`/api/assignments/${jobId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                new_status: nextStatus,
                changed_by: teamMemberId,
            }),
        });

        if (res.ok) {
            toast.success(
                nextStatus === "completed"
                    ? "Job completed!"
                    : `Status updated: ${nextStatus.replace("_", " ")}`
            );
            router.refresh();
        } else {
            const { error } = await res.json();
            toast.error(error ?? "Failed to update status");
        }
        setLoading(false);
    }

    return (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div>
                <p className="text-xs text-muted-foreground">Next action</p>
                <p className="text-sm mt-0.5">
                    {STATUS_DESCRIPTIONS[currentStatus]}
                </p>
            </div>
            <Button
                onClick={handleAdvance}
                disabled={loading}
                size="lg"
                className="w-full h-12 text-base font-semibold"
            >
                {loading ? "Updating…" : STATUS_LABELS[currentStatus] ?? "Advance Status"}
            </Button>
        </div>
    );
}
