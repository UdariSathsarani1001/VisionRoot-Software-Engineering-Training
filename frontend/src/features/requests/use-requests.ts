'use client';

import { useState, useEffect, useCallback } from 'react';
import { listRequests, updateRequestStatus, ApiError } from '@/lib/api';
import type { Request, RequestStatus } from './types';

interface UseRequestsState {
  requests: Request[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useRequests(status?: RequestStatus): UseRequestsState {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;

    // Reset synchronously before fetching — this is the standard async pattern;
    // the effect runs after the render so no cascading render occurs in practice.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    listRequests(status)
      .then((data) => {
        if (!cancelled) {
          setRequests(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : 'An unexpected error occurred',
          );
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [status, tick]);

  return { requests, loading, error, reload };
}

// --- Single-request status update hook ------------------------------------

interface UseRequestStatusState {
  updating: boolean;
  error: string | null;
  update: (id: number, newStatus: RequestStatus) => Promise<Request | null>;
}

/**
 * Hook that wraps updateRequestStatus from api.ts and manages its loading
 * and error state. The caller receives the updated request on success, or
 * null on failure (with error set).
 */
export function useRequestStatus(): UseRequestStatusState {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (id: number, newStatus: RequestStatus): Promise<Request | null> => {
      setUpdating(true);
      setError(null);
      try {
        const updated = await updateRequestStatus(id, newStatus);
        return updated;
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : 'An unexpected error occurred',
        );
        return null;
      } finally {
        setUpdating(false);
      }
    },
    [],
  );

  return { updating, error, update };
}
