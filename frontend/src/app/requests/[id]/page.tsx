import { Suspense } from 'react';
import { RequestDetails } from '@/features/requests/request-details';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamic route — params resolved at request time
export const dynamic = 'force-dynamic';

interface RequestPageProps {
  params: Promise<{ id: string }>;
}

export default async function RequestPage({ params }: RequestPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <RequestDetails id={numericId} />
    </Suspense>
  );
}
