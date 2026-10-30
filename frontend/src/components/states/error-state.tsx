import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong while loading data.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <AlertTitle>Unable to load</AlertTitle>
          <AlertDescription className="mt-1">{message}</AlertDescription>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="shrink-0 border-red-400/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            Try again
          </Button>
        )}
      </div>
    </Alert>
  );
}
