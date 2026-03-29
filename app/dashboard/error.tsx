"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
      <AlertTriangle className="h-12 w-12 text-destructive" aria-hidden />
      <div className="text-center">
        <h2 className="text-lg font-semibold">Dashboard failed to load</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {error.message ?? "An unexpected error occurred."}
        </p>
      </div>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </main>
  );
}
