import { z } from 'zod';
import { CATEGORIES, PRIORITIES, STATUSES } from './types';

export const createRequestSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Title must be 3 to 100 characters')
      .max(100, 'Title must be 3 to 100 characters'),
    description: z
      .string()
      .min(1, 'Description is required')
      .max(1000, 'Description must be 1 to 1000 characters'),
    category: z.enum(CATEGORIES, {
      error: `Category must be one of: ${CATEGORIES.join(', ')}`,
    }),
    priority: z.enum(PRIORITIES, {
      error: `Priority must be one of: ${PRIORITIES.join(', ')}`,
    }),
  })
  .strict(); // rejects unknown fields

export const listRequestsQuerySchema = z.object({
  status: z
    .enum(STATUSES, {
      error: `Status must be one of: ${STATUSES.join(', ')}`,
    })
    .optional(),
});

export const requestIdSchema = z.object({
  id: z.coerce
    .number()
    .int('id must be an integer')
    .positive('id must be a positive integer'),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type ListRequestsQuery = z.infer<typeof listRequestsQuerySchema>;
