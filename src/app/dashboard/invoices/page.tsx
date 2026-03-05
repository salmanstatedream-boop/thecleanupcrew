import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const STATUS_COLORS: Record<string, string> = {
    draft: "bg-gray-500/10 text-gray-500",
    sent: "bg-blue-500/10 text-blue-600",
    paid: "bg-green-500/10 text-green-600",
    void: "bg-red-500/10 text-red-500",
    partially_paid: "bg-yellow-500/10 text-yellow-600",
};

async function getInvoices() {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
        .from("invoices")
        .select("id, status, total_amount, tax_amount, due_date, created_at, places(address)")
        .order("created_at", { ascending: false });
    return data ?? [];
}

export default async function InvoicesPage() {
    const invoices = await getInvoices();

    return (
        <div className="p-6 space-y-6 max-w-7xl">
            <div>
                <h1 className="text-2xl font-semibold">Invoices</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}
                </p>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Created</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Tax</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center py-12 text-muted-foreground"
                                >
                                    No invoices yet. Invoices will appear here once jobs are completed.
                                </TableCell>
                            </TableRow>
                        ) : (
                            invoices.map((inv) => (
                                <TableRow key={inv.id} className="hover:bg-muted/40">
                                    <TableCell className="text-sm">
                                        {new Date(inv.created_at).toLocaleDateString("en-CA")}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {((inv.places as unknown) as { address: string } | null)?.address ?? "—"}
                                    </TableCell>
                                    <TableCell className="text-sm font-medium">
                                        {inv.total_amount != null
                                            ? `$${inv.total_amount.toFixed(2)}`
                                            : "—"}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {inv.tax_amount != null
                                            ? `$${inv.tax_amount.toFixed(2)}`
                                            : "—"}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {inv.due_date
                                            ? new Date(inv.due_date + "T00:00:00").toLocaleDateString("en-CA")
                                            : "—"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={STATUS_COLORS[inv.status]}
                                        >
                                            {inv.status.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
