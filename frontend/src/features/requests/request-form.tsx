'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createRequest, ApiError } from '@/lib/api';
import { validateRequestInput, type FieldError } from './validation';
import {
  CATEGORIES,
  PRIORITIES,
  CATEGORY_LABELS,
  PRIORITY_LABELS,
} from './constants';
import type {
  CreateRequestInput,
  RequestCategory,
  RequestPriority,
} from './types';

interface FormState {
  title: string;
  description: string;
  category: string;
  priority: string;
}

const INITIAL_FORM: FormState = {
  title: '',
  description: '',
  category: '',
  priority: '',
};

function getFieldError(errors: FieldError[], field: keyof CreateRequestInput) {
  return errors.find((e) => e.field === field)?.message;
}

export function RequestForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => prev.filter((e) => e.field !== field));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const input: Partial<CreateRequestInput> = {
      title: form.title,
      description: form.description,
      category: form.category as RequestCategory | undefined,
      priority: form.priority as RequestPriority | undefined,
    };

    const { valid, errors } = validateRequestInput(input);
    if (!valid) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      await createRequest(input as CreateRequestInput);
      setSubmitted(true);
      setTimeout(() => router.push('/'), 1500);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : 'An unexpected error occurred. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Success ──────────────────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-2xl text-emerald-500"
        >
          ✓
        </span>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Request submitted</h2>
          <p className="text-sm sd-muted">Redirecting you to the list…</p>
        </div>
      </div>
    );
  }

  /* ── Form ─────────────────────────────────────────────────────────── */
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Create service request"
      className="space-y-6"
    >
      {/* Submit error */}
      {submitError && (
        <Alert variant="destructive">
          <AlertTitle>Submission failed</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">
          Title <span aria-hidden="true" className="sd-field-error">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          maxLength={100}
          placeholder="e.g. Laptop will not start"
          aria-describedby={
            getFieldError(fieldErrors, 'title') ? 'title-error' : 'title-hint'
          }
          aria-invalid={!!getFieldError(fieldErrors, 'title')}
          className={
            getFieldError(fieldErrors, 'title')
              ? 'border-[hsl(var(--destructive))] focus-visible:ring-[hsl(var(--destructive))]'
              : ''
          }
        />
        {getFieldError(fieldErrors, 'title') ? (
          <p id="title-error" role="alert" className="text-sm font-medium sd-field-error">
            {getFieldError(fieldErrors, 'title')}
          </p>
        ) : (
          <p id="title-hint" className="text-xs sd-field-hint">
            3 to 100 characters
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">
          Description <span aria-hidden="true" className="sd-field-error">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          maxLength={1000}
          placeholder="What happened, when, and what you have already tried"
          rows={5}
          aria-describedby={
            getFieldError(fieldErrors, 'description')
              ? 'description-error'
              : 'description-hint'
          }
          aria-invalid={!!getFieldError(fieldErrors, 'description')}
          className={
            getFieldError(fieldErrors, 'description')
              ? 'border-[hsl(var(--destructive))] focus-visible:ring-[hsl(var(--destructive))]'
              : ''
          }
        />
        {getFieldError(fieldErrors, 'description') ? (
          <p id="description-error" role="alert" className="text-sm font-medium sd-field-error">
            {getFieldError(fieldErrors, 'description')}
          </p>
        ) : (
          <p id="description-hint" className="text-right text-xs sd-field-hint">
            {form.description.length} / 1000
          </p>
        )}
      </div>

      {/* Category + Priority — side by side on sm+ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Category */}
        <div className="space-y-1.5">
          <Label htmlFor="category">
            Category <span aria-hidden="true" className="sd-field-error">*</span>
          </Label>
          <Select
            value={form.category}
            onValueChange={(v) => handleChange('category', v)}
          >
            <SelectTrigger
              id="category"
              aria-describedby={
                getFieldError(fieldErrors, 'category') ? 'category-error' : undefined
              }
              aria-invalid={!!getFieldError(fieldErrors, 'category')}
              className={
                getFieldError(fieldErrors, 'category')
                  ? 'border-[hsl(var(--destructive))] focus:ring-[hsl(var(--destructive))]'
                  : ''
              }
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getFieldError(fieldErrors, 'category') && (
            <p id="category-error" role="alert" className="text-sm font-medium sd-field-error">
              {getFieldError(fieldErrors, 'category')}
            </p>
          )}
        </div>

        {/* Priority */}
        <div className="space-y-1.5">
          <Label htmlFor="priority">
            Priority <span aria-hidden="true" className="sd-field-error">*</span>
          </Label>
          <Select
            value={form.priority}
            onValueChange={(v) => handleChange('priority', v)}
          >
            <SelectTrigger
              id="priority"
              aria-describedby={
                getFieldError(fieldErrors, 'priority') ? 'priority-error' : undefined
              }
              aria-invalid={!!getFieldError(fieldErrors, 'priority')}
              className={
                getFieldError(fieldErrors, 'priority')
                  ? 'border-[hsl(var(--destructive))] focus:ring-[hsl(var(--destructive))]'
                  : ''
              }
            >
              <SelectValue placeholder="Select a priority" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {PRIORITY_LABELS[p]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getFieldError(fieldErrors, 'priority') && (
            <p id="priority-error" role="alert" className="text-sm font-medium sd-field-error">
              {getFieldError(fieldErrors, 'priority')}
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <hr className="sd-divider" />

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/')}
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
              />
              Submitting…
            </span>
          ) : (
            'Submit request'
          )}
        </Button>
      </div>
    </form>
  );
}
