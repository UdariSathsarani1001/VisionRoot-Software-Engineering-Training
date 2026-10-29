import type { RequestCategory, RequestPriority, RequestStatus } from './types';
import type { BadgeProps } from '@/components/ui/badge';

// --- Allowed values -------------------------------------------------------

export const CATEGORIES: RequestCategory[] = ['IT', 'Facilities', 'Other'];

export const PRIORITIES: RequestPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

export const STATUSES: RequestStatus[] = [
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
];

// --- Labels ---------------------------------------------------------------

export const CATEGORY_LABELS: Record<RequestCategory, string> = {
  IT: 'IT',
  Facilities: 'Facilities',
  Other: 'Other',
};

export const PRIORITY_LABELS: Record<RequestPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const STATUS_LABELS: Record<RequestStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

// --- Badge variants -------------------------------------------------------

export const STATUS_BADGE_VARIANTS: Record<
  RequestStatus,
  BadgeProps['variant']
> = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

export const PRIORITY_BADGE_VARIANTS: Record<
  RequestPriority,
  BadgeProps['variant']
> = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// --- Validation limits ----------------------------------------------------

export const TITLE_MIN = 3;
export const TITLE_MAX = 100;
export const DESCRIPTION_MIN = 1;
export const DESCRIPTION_MAX = 1000;
