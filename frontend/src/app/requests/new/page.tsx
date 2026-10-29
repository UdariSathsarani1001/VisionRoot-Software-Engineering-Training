import Link from 'next/link';
import { RequestForm } from '@/features/requests/request-form';

export const metadata = {
  title: 'New Request – ServiceDesk',
};

export default function NewRequestPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Back link */}
      <nav aria-label="Breadcrumb">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm sd-muted transition-colors hover:underline focus-visible:underline"
        >
          ← Back to requests
        </Link>
      </nav>

      {/* Heading */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          New service request
        </h1>
        <p className="mt-1 text-sm sd-muted">
          All fields are required.
        </p>
      </div>

      {/* Form card */}
      <div className="sd-form-card p-6 sm:p-8">
        <RequestForm />
      </div>
    </div>
  );
}
