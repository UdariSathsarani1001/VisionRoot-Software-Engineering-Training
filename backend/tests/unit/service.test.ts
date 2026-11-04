import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as repository from '../../src/modules/requests/repository';
import * as service from '../../src/modules/requests/service';

vi.mock('../../src/modules/requests/repository');

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const;
type Status = (typeof STATUSES)[number];

const NEXT: Partial<Record<Status, Status>> = {
  OPEN: 'IN_PROGRESS',
  IN_PROGRESS: 'RESOLVED',
  RESOLVED: 'CLOSED',
};

const makeRequest = (status: Status = 'OPEN') => ({
  id: 1,
  title: 'Laptop will not start',
  description: 'Black screen after pressing the power button.',
  category: 'IT' as const,
  priority: 'HIGH' as const,
  status,
  created_at: '2026-11-04T09:00:00.000Z',
  updated_at: '2026-11-04T09:00:00.000Z',
});

beforeEach(() => {
  vi.resetAllMocks();
});

describe('getRequest', () => {
  it('returns an existing request', async () => {
    vi.mocked(repository.findById).mockResolvedValue(makeRequest());
    await expect(service.getRequest(1)).resolves.toMatchObject({ id: 1 });
  });

  it('throws NOT_FOUND for a missing request', async () => {
    vi.mocked(repository.findById).mockResolvedValue(null);
    await expect(service.getRequest(999)).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });
});

describe('createRequest', () => {
  it('passes the validated input to the repository', async () => {
    vi.mocked(repository.create).mockResolvedValue(makeRequest());
    const input = {
      title: 'Laptop will not start',
      description: 'Black screen.',
      category: 'IT' as const,
      priority: 'HIGH' as const,
    };
    await service.createRequest(input);
    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining(input),
    );
  });
});

describe('updateRequestStatus: every status pair', () => {
  const cases = STATUSES.flatMap((from) =>
    STATUSES.map((to) => ({ from, to, allowed: NEXT[from] === to })),
  );

  it.each(cases)(
    '$from -> $to (allowed: $allowed)',
    async ({ from, to, allowed }) => {
      vi.mocked(repository.findById).mockResolvedValue(makeRequest(from));
      vi.mocked(repository.updateStatus).mockResolvedValue(makeRequest(to));

      if (allowed) {
        await expect(service.updateRequestStatus(1, to)).resolves.toMatchObject(
          { status: to },
        );
        expect(repository.updateStatus).toHaveBeenCalled();
      } else {
        await expect(service.updateRequestStatus(1, to)).rejects.toMatchObject({
          code: 'INVALID_TRANSITION',
        });
        expect(repository.updateStatus).not.toHaveBeenCalled();
      }
    },
  );

  it('throws NOT_FOUND and does not update a missing request', async () => {
    vi.mocked(repository.findById).mockResolvedValue(null);
    await expect(
      service.updateRequestStatus(999, 'IN_PROGRESS'),
    ).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
    expect(repository.updateStatus).not.toHaveBeenCalled();
  });
});
