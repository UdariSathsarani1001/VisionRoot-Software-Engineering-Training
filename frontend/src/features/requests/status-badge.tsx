import { Badge } from '@/components/ui/badge';
import { STATUS_LABELS, STATUS_BADGE_VARIANTS } from './constants';
import type { RequestStatus } from './types';

interface StatusBadgeProps {
  status: RequestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={STATUS_BADGE_VARIANTS[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
