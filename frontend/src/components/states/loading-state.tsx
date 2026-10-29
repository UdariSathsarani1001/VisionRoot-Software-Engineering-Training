import { Skeleton } from '@/components/ui/skeleton';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';

interface LoadingStateProps {
  /** Number of skeleton rows */
  rows?: number;
  /** Number of columns */
  cols?: number;
}

// Vary skeleton widths so it looks more natural
const COL_WIDTHS = ['w-3/4', 'w-1/3', 'w-1/4', 'w-1/4', 'w-1/5'];

export function LoadingState({ rows = 5, cols = 4 }: LoadingStateProps) {
  return (
    <TableBody>
      <TableRow className="sr-only">
        <TableCell colSpan={cols}>
          <span aria-live="polite" aria-busy="true">
            Loading requests…
          </span>
        </TableCell>
      </TableRow>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow key={rowIdx} aria-hidden="true">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <TableCell key={colIdx}>
              <Skeleton
                className={`h-4 ${COL_WIDTHS[colIdx % COL_WIDTHS.length]}`}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
