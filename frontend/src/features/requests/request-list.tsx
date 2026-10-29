'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingState } from '@/components/states/loading-state';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { StatusBadge } from './status-badge';
import { PriorityBadge } from './priority-badge';
import { StatusFilter } from './status-filter';
import { useRequests } from './use-requests';
import type { RequestStatus } from './types';

export function RequestList() {
  const [statusFilter, setStatusFilter] = useState<RequestStatus | undefined>(
    undefined,
  );
  const { requests, loading, error, reload } = useRequests(statusFilter);

  return (
    <div className="space-y-5">
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Service Requests
          </h1>
          <p className="mt-0.5 text-sm sd-muted">
            Track and manage all open service requests
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/requests/new">+ New request</Link>
        </Button>
      </div>

      {/* ── Filter bar ────────────────────────────────────────────────── */}
      <div className="sd-filter-bar px-4 py-3">
        <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      </div>

      {/* ── Error ─────────────────────────────────────────────────────── */}
      {error && <ErrorState message={error} onRetry={reload} />}

      {/* ── Desktop table (md+) ───────────────────────────────────────── */}
      {!error && (
        <div className="hidden md:block">
          <div className="sd-table-wrap">
            <Table>
              <TableHeader>
                <TableRow className="sd-table-head-row hover:bg-transparent">
                  <TableHead className="w-[45%]">Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              {loading ? (
                <LoadingState rows={5} cols={4} />
              ) : requests.length === 0 ? (
                <TableBody>
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="p-0">
                      <EmptyState />
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/requests/${req.id}`}
                          className="underline-offset-4 hover:underline focus-visible:underline"
                        >
                          {req.title}
                        </Link>
                      </TableCell>
                      <TableCell className="sd-muted">{req.category}</TableCell>
                      <TableCell>
                        <PriorityBadge priority={req.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={req.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>

          {!loading && requests.length > 0 && (
            <p className="mt-2 text-right text-xs sd-muted">
              {requests.length} request{requests.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* ── Mobile card stack (below md) ──────────────────────────────── */}
      {!error && (
        <div className="space-y-3 md:hidden">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="space-y-3 p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-1/3" />
                </CardContent>
              </Card>
            ))
          ) : requests.length === 0 ? (
            <EmptyState />
          ) : (
            requests.map((req) => (
              <Link key={req.id} href={`/requests/${req.id}`}>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium leading-snug">
                        {req.title}
                      </p>
                      <StatusBadge status={req.status} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <PriorityBadge priority={req.priority} />
                      <span className="text-xs sd-muted">{req.category}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
