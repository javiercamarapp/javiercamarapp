"use client";

import { useState, useEffect, useCallback } from "react";

const PENDING_KEY = "hatoai_pending_sync";

interface PendingMutation {
  id: string;
  timestamp: number;
  endpoint: string;
  method: string;
  body: unknown;
}

function getPending(): PendingMutation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as PendingMutation[]) : [];
  } catch {
    return [];
  }
}

function setPending(mutations: PendingMutation[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PENDING_KEY, JSON.stringify(mutations));
}

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState(0);

  // Sync pending mutations when coming back online
  const syncPending = useCallback(async () => {
    const mutations = getPending();
    if (mutations.length === 0) return;

    const remaining: PendingMutation[] = [];

    for (const mutation of mutations) {
      try {
        await fetch(mutation.endpoint, {
          method: mutation.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mutation.body),
        });
      } catch {
        remaining.push(mutation);
      }
    }

    setPending(remaining);
    setPendingSync(remaining.length);
  }, []);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    setPendingSync(getPending().length);

    function handleOnline() {
      setIsOnline(true);
      void syncPending();
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for storage changes from other tabs
    function handleStorage(e: StorageEvent) {
      if (e.key === PENDING_KEY) {
        setPendingSync(getPending().length);
      }
    }
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("storage", handleStorage);
    };
  }, [syncPending]);

  /** Queue a mutation for later sync */
  const queueMutation = useCallback(
    (endpoint: string, method: string, body: unknown) => {
      const mutation: PendingMutation = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        endpoint,
        method,
        body,
      };
      const current = getPending();
      current.push(mutation);
      setPending(current);
      setPendingSync(current.length);
    },
    []
  );

  return { isOnline, pendingSync, queueMutation };
}
