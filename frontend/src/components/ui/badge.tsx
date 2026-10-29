import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Badge colours are hard-coded (not CSS variables) so they stay vivid in both
 * light and dark mode without needing dark: prefix variants.
 * Each variant chooses colours that work on both light and dark backgrounds.
 */
const badgeVariants = cva(
  'inline-flex items-center rounded-full border-0 px-2.5 py-0.5 text-xs font-semibold',
  {
    variants: {
      variant: {
        default:
          'bg-neutral-800 text-white',
        secondary:
          'bg-neutral-200 text-neutral-800',
        destructive:
          'bg-red-600 text-white',
        outline:
          'border border-[hsl(var(--border))] text-[hsl(var(--foreground))]',

        /* ── Status ──────────────────────────────────────────────────── */
        open:
          'bg-blue-500/20 text-blue-400 ring-1 ring-inset ring-blue-500/30',
        in_progress:
          'bg-amber-500/20 text-amber-400 ring-1 ring-inset ring-amber-500/30',
        resolved:
          'bg-emerald-500/20 text-emerald-400 ring-1 ring-inset ring-emerald-500/30',
        closed:
          'bg-neutral-500/20 text-neutral-400 ring-1 ring-inset ring-neutral-500/30',

        /* ── Priority ────────────────────────────────────────────────── */
        low:
          'bg-slate-500/20 text-slate-400 ring-1 ring-inset ring-slate-500/30',
        medium:
          'bg-orange-500/20 text-orange-400 ring-1 ring-inset ring-orange-500/30',
        high:
          'bg-red-500/20 text-red-400 ring-1 ring-inset ring-red-500/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
