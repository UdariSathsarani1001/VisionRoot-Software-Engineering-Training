export const CATEGORIES = ['IT', 'Facilities', 'Other'] as const;
export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
export const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const;

export type Category = (typeof CATEGORIES)[number];
export type Priority = (typeof PRIORITIES)[number];
export type Status = (typeof STATUSES)[number];

export interface ServiceRequest {
  id: number;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: Status;
  created_at: string;
  updated_at: string;
}

export interface CreateRequestInput {
  title: string;
  description: string;
  category: Category;
  priority: Priority;
}
