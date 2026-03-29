import Link from "next/link";
import { Button } from "@/features/shared/components/ui/button";

export default function CustomerNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
      <div className="text-center">
        <h2 className="text-4xl font-bold">404</h2>
        <p className="mt-2 text-lg font-medium">Customer not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The customer you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
    </main>
  );
}
