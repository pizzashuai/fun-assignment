import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchCustomer } from "@/features/customers/api/fetch-customer";
import { Card, CardContent } from "@/features/shared/components/ui/card";
import { Badge } from "@/features/shared/components/ui/badge";
import { HealthBadge } from "@/features/customers/components/health-badge";
import { ActivityTable } from "@/features/customers/components/activity-table";
import { TrendChartClient, FeatureBarChartClient } from "@/features/shared/components/charts/chart-wrappers";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const customer = await fetchCustomer(id);
  return {
    title: customer ? `${customer.name} — Customer Detail` : "Customer Not Found",
  };
}

export default async function CustomerPage({ params }: Props) {
  const { id } = await params;
  const customer = await fetchCustomer(id);

  if (!customer) notFound();

  return (
    <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground focus:outline-none focus-visible:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Dashboard
          </Link>
        </nav>

        {/* Customer hero */}
        <section aria-label="Customer summary">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{customer.name}</h1>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline" className="capitalize">{customer.segment}</Badge>
                    <Badge variant="outline" className="capitalize">{customer.region.replace("-", " ")}</Badge>
                    <Badge variant="outline" className="capitalize">{customer.plan}</Badge>
                  </div>
                  <div className="mt-3">
                    <HealthBadge score={customer.healthScore} riskLevel={customer.riskLevel} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center sm:grid-cols-3">
                  <div>
                    <p className="text-2xl font-bold tabular-nums">
                      {customer.mau >= 1000 ? `${(customer.mau / 1000).toFixed(1)}k` : customer.mau}
                    </p>
                    <p className="text-xs text-muted-foreground">MAU</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold tabular-nums">{customer.retentionRate}%</p>
                    <p className="text-xs text-muted-foreground">Retention</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold tabular-nums">
                      ${(customer.mrr / 1000).toFixed(0)}k
                    </p>
                    <p className="text-xs text-muted-foreground">MRR</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Usage trend + feature adoption */}
        <section
          aria-label="Usage trend and feature adoption"
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          <TrendChartClient data={customer.usageTrend.slice(-30)} title="Usage Trend (last 30 days)" />
          <FeatureBarChartClient data={customer.topFeatures} title="Top Used Features" />
        </section>

        {/* Activity table */}
        <section aria-label="Recent customer activity">
          <ActivityTable events={customer.recentEvents} />
        </section>
      </div>
    </main>
  );
}
