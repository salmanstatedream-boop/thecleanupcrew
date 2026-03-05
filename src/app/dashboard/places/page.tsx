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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

async function getPlaces() {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
        .from("places")
        .select("id, address, city, province, postal_code, recurring_schedule, created_at")
        .order("created_at", { ascending: false });
    return data ?? [];
}

export default async function PlacesPage() {
    const places = await getPlaces();

    return (
        <div className="p-6 space-y-6 max-w-7xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Places</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {places.length} job site{places.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button size="sm" className="gap-1.5" disabled>
                    <Plus size={16} />
                    Add Place
                </Button>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Address</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Province</TableHead>
                            <TableHead>Postal Code</TableHead>
                            <TableHead>Schedule</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {places.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center py-12 text-muted-foreground"
                                >
                                    No places yet. Places will appear here once jobs are created with a location.
                                </TableCell>
                            </TableRow>
                        ) : (
                            places.map((place) => (
                                <TableRow key={place.id} className="hover:bg-muted/40">
                                    <TableCell className="font-medium">{place.address}</TableCell>
                                    <TableCell className="text-muted-foreground">{place.city ?? "—"}</TableCell>
                                    <TableCell className="text-muted-foreground">{place.province ?? "—"}</TableCell>
                                    <TableCell className="text-muted-foreground">{place.postal_code ?? "—"}</TableCell>
                                    <TableCell>
                                        {place.recurring_schedule ? (
                                            <Badge variant="outline" className="text-xs">
                                                {place.recurring_schedule}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">One-time</span>
                                        )}
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
