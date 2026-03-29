"use client";

import Link from "next/link";
import { Pin, PinOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/features/shared/components/ui/badge";
import { Button } from "@/features/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import { cn } from "@/features/shared/utils";
import { togglePinnedCustomer } from "@/features/shared/data/pinned-customers-storage";
import type { CustomerSummary } from "@/features/customers/types";

const riskColors: Record<CustomerSummary["riskLevel"], string> = {
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

interface CustomersTableProps {
  customers: CustomerSummary[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const pinMutation = useMutation({
    mutationFn: async (id: string) => {
      const pinned = togglePinnedCustomer(id);
      return { pinned };
    },
    onSuccess: (_data, id) => {
      const customer = customers.find((c) => c.id === id);
      if (_data.pinned) {
        toast.success(`${customer?.name ?? "Customer"} pinned to watchlist.`);
      } else {
        toast.success(`${customer?.name ?? "Customer"} unpinned.`);
      }
    },
    onError: () => {
      toast.error("Failed to update pin. Please try again.");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Top Customers</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Top customers">
            <thead>
              <tr className="border-b border-border text-left">
                <th scope="col" className="w-8 px-4 py-2" aria-label="Pin" />
                <th scope="col" className="px-4 py-2 font-medium text-muted-foreground">
                  Customer
                </th>
                <th scope="col" className="px-4 py-2 font-medium text-muted-foreground">
                  Segment
                </th>
                <th scope="col" className="px-4 py-2 font-medium text-muted-foreground text-right">
                  MAU
                </th>
                <th scope="col" className="px-4 py-2 font-medium text-muted-foreground text-right">
                  Retention
                </th>
                <th scope="col" className="px-4 py-2 font-medium text-muted-foreground">
                  Risk
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className={cn(
                    "border-b border-border last:border-0 hover:bg-muted/50 transition-colors",
                    c.pinned && "bg-muted/30"
                  )}
                >
                  <td className="px-2 py-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-7 w-7",
                        c.pinned ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                      aria-label={c.pinned ? `Unpin ${c.name}` : `Pin ${c.name} to watchlist`}
                      disabled={pinMutation.isPending && pinMutation.variables === c.id}
                      onClick={() => pinMutation.mutate(c.id)}
                    >
                      {c.pinned ? (
                        <Pin className="h-3.5 w-3.5 fill-current" aria-hidden />
                      ) : (
                        <PinOff className="h-3.5 w-3.5" aria-hidden />
                      )}
                    </Button>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/customers/${c.id}`}
                      className="font-medium text-primary hover:underline focus:outline-none focus-visible:underline"
                    >
                      {c.name}
                    </Link>
                    <p className="text-xs text-muted-foreground capitalize">{c.region.replace("-", " ")}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">{c.segment}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {c.mau >= 1000 ? `${(c.mau / 1000).toFixed(1)}k` : c.mau}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{c.retentionRate}%</td>
                  <td className="px-4 py-3">
                    <Badge
                      className={cn(
                        "capitalize border-0 text-xs font-medium",
                        riskColors[c.riskLevel]
                      )}
                    >
                      {c.riskLevel}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
