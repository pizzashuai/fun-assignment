"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 text-center"
      role="alert"
    >
      <AlertTriangle className="mb-3 h-10 w-10 text-destructive" aria-hidden />
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-4">
          Retry
        </Button>
      )}
    </div>
  );
}
