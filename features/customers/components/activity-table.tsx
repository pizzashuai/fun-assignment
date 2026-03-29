import { format, parseISO } from "date-fns";
import { Badge } from "@/features/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shared/components/ui/card";
import type { CustomerEvent } from "@/features/customers/types";

const EVENT_LABELS: Record<CustomerEvent["type"], string> = {
  login: "Login",
  feature_use: "Feature Use",
  export: "Export",
  api_call: "API Call",
  support_ticket: "Support",
  upgrade: "Upgrade",
};

const EVENT_COLORS: Record<CustomerEvent["type"], string> = {
  login: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  feature_use: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  export: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  api_call: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  support_ticket: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  upgrade: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

interface ActivityTableProps {
  events: CustomerEvent[];
}

export function ActivityTable({ events }: ActivityTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-sm" aria-label="Recent customer activity">
          <thead>
            <tr className="border-b border-border text-left">
              <th scope="col" className="px-4 py-2 font-medium text-muted-foreground">Event</th>
              <th scope="col" className="px-4 py-2 font-medium text-muted-foreground">Description</th>
              <th scope="col" className="px-4 py-2 font-medium text-muted-foreground text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3">
                  <Badge className={`border-0 text-xs font-medium ${EVENT_COLORS[e.type]}`}>
                    {EVENT_LABELS[e.type]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{e.description}</td>
                <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                  {format(parseISO(e.timestamp), "MMM d, yyyy")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
