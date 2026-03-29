"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import Link from "next/link";

interface CustomerErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CustomerError({ error, reset }: CustomerErrorProps) {
  useEffect(() => {
    console.error("Customer page error:", error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
      <AlertTriangle className="h-12 w-12 text-destructive" aria-hidden />
      <div className="text-center">
        <h2 className="text-lg font-semibold">Customer page failed to load</h2>
        <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset} variant="outline">Try again</Button>
        <Button asChild variant="ghost">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
