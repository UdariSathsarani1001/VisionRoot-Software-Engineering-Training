import type { CreateRequestInput } from './types';
import {
  CATEGORIES,
  PRIORITIES,
  TITLE_MIN,
  TITLE_MAX,
  DESCRIPTION_MIN,
  DESCRIPTION_MAX,
} from './constants';

export interface FieldError {
  field: keyof CreateRequestInput;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: FieldError[];
}

/**
 * Validate create-request input using the same rules as the server.
 * Mirrors: FR-01 to FR-05 from requirements.md
 */
export function validateRequestInput(
  input: Partial<CreateRequestInput>,
): ValidationResult {
  const errors: FieldError[] = [];

  // title: required, 3 to 100 characters after trimming
  const title = (input.title ?? '').trim();
  if (title.length < TITLE_MIN) {
    errors.push({
      field: 'title',
      message: `Title must be at least ${TITLE_MIN} characters`,
    });
  } else if (title.length > TITLE_MAX) {
    errors.push({
      field: 'title',
      message: `Title must be ${TITLE_MAX} characters or fewer`,
    });
  }

  // description: required, 1 to 1000 characters
  const description = input.description ?? '';
  if (description.length < DESCRIPTION_MIN) {
    errors.push({
      field: 'description',
      message: 'Description is required',
    });
  } else if (description.length > DESCRIPTION_MAX) {
    errors.push({
      field: 'description',
      message: `Description must be ${DESCRIPTION_MAX} characters or fewer`,
    });
  }

  // category: required, must be a known value
  if (!input.category) {
    errors.push({ field: 'category', message: 'Category is required' });
  } else if (!CATEGORIES.includes(input.category)) {
    errors.push({ field: 'category', message: 'Invalid category' });
  }

  // priority: required, must be a known value
  if (!input.priority) {
    errors.push({ field: 'priority', message: 'Priority is required' });
  } else if (!PRIORITIES.includes(input.priority)) {
    errors.push({ field: 'priority', message: 'Invalid priority' });
  }

  return { valid: errors.length === 0, errors };
}
