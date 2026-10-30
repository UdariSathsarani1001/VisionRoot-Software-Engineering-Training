export type RequestCategory = 'IT' | 'Facilities' | 'Other';
export type RequestPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type RequestStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface Request {
  id: number;
  title: string;
  description: string;
  category: RequestCategory;
  priority: RequestPriority;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateRequestInput {
  title: string;
  description: string;
  category: RequestCategory;
  priority: RequestPriority;
}
