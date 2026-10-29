interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = 'No requests match the selected filter.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span aria-hidden="true" className="text-4xl" style={{ opacity: 0.3 }}>
        📋
      </span>
      <div className="space-y-1">
        <p className="text-sm font-medium sd-muted">Nothing here</p>
        <p className="text-xs sd-muted">{message}</p>
      </div>
    </div>
  );
}
