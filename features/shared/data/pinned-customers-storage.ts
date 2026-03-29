"use client";

import { useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "analytics-dashboard:pinned-customer-ids";

function parseStoredIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string" && id.length > 0).sort();
  } catch {
    return [];
  }
}

/** Stable primitive snapshot for useSyncExternalStore (new Set() every read would infinite-loop). */
function getSnapshotKey(): string {
  if (typeof window === "undefined") return "[]";
  const ids = parseStoredIds(localStorage.getItem(STORAGE_KEY));
  return JSON.stringify(ids);
}

function readIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  return new Set(parseStoredIds(localStorage.getItem(STORAGE_KEY)));
}

function writeIds(ids: Set<string>) {
  const sorted = [...ids].sort();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted));
}

const listeners = new Set<() => void>();

function emit() {
  for (const cb of listeners) cb();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function getServerSnapshot(): string {
  return "[]";
}

/** Pin state for SSR/hydration: empty on server, real set on client after subscribe. */
export function usePinnedCustomerIds(): ReadonlySet<string> {
  const key = useSyncExternalStore(subscribe, getSnapshotKey, getServerSnapshot);
  return useMemo(() => new Set(JSON.parse(key) as string[]), [key]);
}

/** Toggle pin for a customer; persists to localStorage and notifies subscribers. Returns new pinned flag. */
export function togglePinnedCustomer(id: string): boolean {
  const next = readIds();
  const pinned = !next.has(id);
  if (pinned) next.add(id);
  else next.delete(id);
  writeIds(next);
  emit();
  return pinned;
}
