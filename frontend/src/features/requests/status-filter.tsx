'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { STATUSES, STATUS_LABELS } from './constants';
import type { RequestStatus } from './types';

// Radix Select does not allow empty string values
const ALL_VALUE = 'ALL';

interface StatusFilterProps {
  value: RequestStatus | undefined;
  onChange: (value: RequestStatus | undefined) => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Label htmlFor="status-filter" className="shrink-0 text-sm font-medium">
        Filter by status
      </Label>
      <Select
        value={value ?? ALL_VALUE}
        onValueChange={(v) =>
          onChange(v === ALL_VALUE ? undefined : (v as RequestStatus))
        }
      >
        <SelectTrigger id="status-filter" className="w-[180px]">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All statuses</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
