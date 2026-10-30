'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/states/error-state';
import { StatusBadge } from './status-badge';
import { PriorityBadge } from './priority-badge';
import { getRequest, ApiError } from '@/lib/api';
import type { Request } from './types';

interface RequestDetailsProps {
  id: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function DetailsSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Skeleton className="h-5 w-32" />
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-7 w-2/3" />
          <div className="mt-2 flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
          <hr className="sd-divider" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function RequestDetails({ id }: RequestDetailsProps) {
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFoundFlag, setNotFoundFlag] = useState(false);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    getRequest(id)
      .then((data) => {
        if (!cancelled) {
          setRequest(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          if (err instanceof ApiError && err.code === 'NOT_FOUND') {
            setNotFoundFlag(true);
          } else {
            setError(
              err instanceof ApiError ? err.message : 'An unexpected error occurred',
            );
          }
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [id, tick]);

  if (notFoundFlag) notFound();
  if (loading) return <DetailsSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!request) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Back */}
      <nav aria-label="Breadcrumb">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/">← Back to requests</Link>
        </Button>
      </nav>

      <Card>
        <CardHeader className="pb-3">
          {/* Title + badges row */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <CardTitle className="text-xl leading-snug">{request.title}</CardTitle>
            <div className="flex shrink-0 gap-2">
              <StatusBadge status={request.status} />
              <PriorityBadge priority={request.priority} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Metadata */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            {[
              { label: 'Category', value: request.category },
              { label: 'Request ID', value: `#${request.id}`, mono: true },
              {
                label: 'Created',
                value: formatDate(request.created_at),
                datetime: request.created_at,
              },
              {
                label: 'Last updated',
                value: formatDate(request.updated_at),
                datetime: request.updated_at,
              },
            ].map(({ label, value, mono, datetime }) => (
              <div key={label}>
                <dt className="text-xs font-medium uppercase tracking-wide sd-muted">
                  {label}
                </dt>
                <dd className={`mt-1 text-sm ${mono ? 'font-mono' : ''}`}>
                  {datetime ? (
                    <time dateTime={datetime}>{value}</time>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <hr className="sd-divider" />

          {/* Description */}
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide sd-muted">
              Description
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {request.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
