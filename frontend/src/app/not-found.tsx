import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24 text-center">
      <p aria-hidden="true" className="text-8xl font-black tracking-tight sd-muted" style={{ opacity: 0.15 }}>
        404
      </p>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="max-w-xs text-sm sd-muted">
          The page you are looking for does not exist or may have been moved.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="/">← Back to requests</Link>
      </Button>
    </div>
  );
}
