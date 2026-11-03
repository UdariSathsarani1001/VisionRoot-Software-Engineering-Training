'use client';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NEXT_STATUS } from './constants';
import { useRequestStatus } from './use-requests';
import type { Request } from './types';

interface StatusActionsProps {
  request: Request;
  onUpdated: (updated: Request) => void;
}

/**
 * Renders the single "next step" action button for a request.
 * Shows nothing when the request is CLOSED (no further transitions).
 *
 * The button label and target status come from NEXT_STATUS in constants.ts,
 * which is a UI convenience only. The server enforces the actual transition
 * rules — a direct PATCH with an invalid transition will still be rejected.
 */
export function StatusActions({ request, onUpdated }: StatusActionsProps) {
  const { updating, error, update } = useRequestStatus();

  const next = NEXT_STATUS[request.status];

  // No further action for CLOSED (or any status not in the map)
  if (!next) return null;

  async function handleClick() {
    const updated = await update(request.id, next!.status);
    if (updated) {
      onUpdated(updated);
    }
  }

  return (
    <div className="space-y-2">
      {/* Error shown above the button so the user does not miss it */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleClick}
        disabled={updating}
        variant="default"
        className="w-full sm:w-auto"
        aria-label={`${next.label} (current status: ${request.status})`}
      >
        {updating ? (
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
            />
            Updating…
          </span>
        ) : (
          next.label
        )}
      </Button>
    </div>
  );
}
