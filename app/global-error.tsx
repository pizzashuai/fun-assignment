"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 font-sans">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-sm text-gray-500">
          An unexpected error occurred. Our team has been notified.
        </p>
        <button
          onClick={reset}
          className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
