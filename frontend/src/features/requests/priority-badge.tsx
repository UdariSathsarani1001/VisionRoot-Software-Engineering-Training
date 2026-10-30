import { Badge } from '@/components/ui/badge';
import { PRIORITY_LABELS, PRIORITY_BADGE_VARIANTS } from './constants';
import type { RequestPriority } from './types';

interface PriorityBadgeProps {
  priority: RequestPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <Badge variant={PRIORITY_BADGE_VARIANTS[priority]}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}
