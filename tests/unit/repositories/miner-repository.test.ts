/**
 * Miner Repository Unit Tests
 */

/* eslint-disable @typescript-eslint/require-await */

import { BraiinsClient, createBraiinsClient } from '../../../src/api/braiins/client';
import { createMinerRepository, createMinerStatusRepository, IMinerRepository, IMinerStatusRepository, MinerRegistrationInput } from '../../../src/repositories';
import { MinerNotFoundError, ValidationError } from '../../../src/utils/errors';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('MinerRepository', () => {
  let repo: IMinerRepository;

  const testMiner: MinerRegistrationInput = {
    id: 'miner-001',
    name: 'Test Miner',
    host: '192.168.1.100',
    port: 80,
    username: 'root',
    password: 'testpass',
    useTls: false,
    tags: ['production', 'rack-1'],
  };

  beforeEach(() => {
    repo = createMinerRepository(null); // No cache for unit tests
  });

  // ==================== Create ====================

  describe('create', () => {
    it('should create a new miner entity', async () => {
      const entity = await repo.create(testMiner);

      expect(entity.id).toBe(testMiner.id);
      expect(entity.name).toBe(testMiner.name);
      expect(entity.host).toBe(testMiner.host);
      expect(entity.port).toBe(testMiner.port);
      expect(entity.username).toBe(testMiner.username);
      expect(entity.password).toBe(testMiner.password);
      expect(entity.useTls).toBe(testMiner.useTls);
      expect(entity.tags).toEqual(testMiner.tags);
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.updatedAt).toBeInstanceOf(Date);
    });

    it('should apply default values', async () => {
      const minimalMiner: MinerRegistrationInput = {
        id: 'miner-002',
        name: 'Minimal Miner',
        host: '192.168.1.101',
        password: 'pass',
      };

      const entity = await repo.create(minimalMiner);

      expect(entity.port).toBe(80);
      expect(entity.username).toBe('root');
      expect(entity.useTls).toBe(false);
      expect(entity.tags).toEqual([]);
    });

    it('should throw ValidationError if miner already exists', async () => {
      await repo.create(testMiner);

      await expect(repo.create(testMiner)).rejects.toThrow(ValidationError);
    });
  });

  // ==================== Read ====================

  describe('findById', () => {
    it('should find an existing miner', async () => {
      await repo.create(testMiner);

      const found = await repo.findById(testMiner.id);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(testMiner.id);
    });

    it('should return null for non-existent miner', async () => {
      const found = await repo.findById('nonexistent');

      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    beforeEach(async () => {
      await repo.create({ ...testMiner, id: 'miner-001', name: 'Alpha', tenantId: 'tenant-1', tags: ['tag-a'] });
      await repo.create({ ...testMiner, id: 'miner-002', name: 'Beta', tenantId: 'tenant-1', tags: ['tag-b'] });
      await repo.create({ ...testMiner, id: 'miner-003', name: 'Gamma', tenantId: 'tenant-2', tags: ['tag-a'] });
    });

    it('should return all miners without filters', async () => {
      const result = await repo.findAll();

      expect(result.data).toHaveLength(3);
      expect(result.pagination.total).toBe(3);
    });

    it('should filter by tenantId', async () => {
      const result = await repo.findAll({ tenantId: 'tenant-1' });

      expect(result.data).toHaveLength(2);
      expect(result.data.every((m) => m.tenantId === 'tenant-1')).toBe(true);
    });

    it('should filter by tags', async () => {
      const result = await repo.findAll({ tags: ['tag-a'] });

      expect(result.data).toHaveLength(2);
    });

    it('should apply pagination', async () => {
      const result = await repo.findAll(undefined, { page: 1, limit: 2 });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(2);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrev).toBe(false);
    });

    it('should sort by name ascending', async () => {
      const result = await repo.findAll(undefined, { sortBy: 'name', sortOrder: 'asc' });

      expect(result.data[0]!.name).toBe('Alpha');
      expect(result.data[1]!.name).toBe('Beta');
      expect(result.data[2]!.name).toBe('Gamma');
    });

    it('should sort by name descending', async () => {
      const result = await repo.findAll(undefined, { sortBy: 'name', sortOrder: 'desc' });

      expect(result.data[0]!.name).toBe('Gamma');
      expect(result.data[1]!.name).toBe('Beta');
      expect(result.data[2]!.name).toBe('Alpha');
    });
  });

  describe('exists', () => {
    it('should return true for existing miner', async () => {
      await repo.create(testMiner);

      expect(await repo.exists(testMiner.id)).toBe(true);
    });

    it('should return false for non-existent miner', async () => {
      expect(await repo.exists('nonexistent')).toBe(false);
    });
  });

  // ==================== Update ====================

  describe('update', () => {
    it('should update miner properties', async () => {
      await repo.create(testMiner);

      // Wait a bit to ensure updatedAt > createdAt (avoid flaky millisecond precision issues)
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });

      const updated = await repo.update(testMiner.id, {
        name: 'Updated Name',
        tags: ['new-tag'],
      });

      expect(updated.name).toBe('Updated Name');
      expect(updated.tags).toEqual(['new-tag']);
      expect(updated.id).toBe(testMiner.id); // ID should not change
      expect(updated.updatedAt.getTime()).toBeGreaterThan(updated.createdAt.getTime());
    });

    it('should throw MinerNotFoundError for non-existent miner', async () => {
      await expect(repo.update('nonexistent', { name: 'New Name' })).rejects.toThrow(MinerNotFoundError);
    });
  });

  // ==================== Delete ====================

  describe('delete', () => {
    it('should delete an existing miner', async () => {
      await repo.create(testMiner);
      expect(await repo.exists(testMiner.id)).toBe(true);

      await repo.delete(testMiner.id);

      expect(await repo.exists(testMiner.id)).toBe(false);
    });

    it('should throw MinerNotFoundError for non-existent miner', async () => {
      await expect(repo.delete('nonexistent')).rejects.toThrow(MinerNotFoundError);
    });
  });

  // ==================== Batch Operations ====================

  describe('findByIds', () => {
    beforeEach(async () => {
      await repo.create({ ...testMiner, id: 'miner-001' });
      await repo.create({ ...testMiner, id: 'miner-002' });
      await repo.create({ ...testMiner, id: 'miner-003' });
    });

    it('should find multiple miners by IDs', async () => {
      const result = await repo.findByIds(['miner-001', 'miner-003']);

      expect(result).toHaveLength(2);
      expect(result.map((m) => m.id).sort()).toEqual(['miner-001', 'miner-003']);
    });

    it('should skip non-existent IDs', async () => {
      const result = await repo.findByIds(['miner-001', 'nonexistent']);

      expect(result).toHaveLength(1);
      expect(result[0]!.id).toBe('miner-001');
    });
  });

  describe('findByTenant', () => {
    beforeEach(async () => {
      await repo.create({ ...testMiner, id: 'miner-001', tenantId: 'tenant-1' });
      await repo.create({ ...testMiner, id: 'miner-002', tenantId: 'tenant-1' });
      await repo.create({ ...testMiner, id: 'miner-003', tenantId: 'tenant-2' });
    });

    it('should find miners by tenant', async () => {
      const result = await repo.findByTenant('tenant-1');

      expect(result).toHaveLength(2);
      expect(result.every((m) => m.tenantId === 'tenant-1')).toBe(true);
    });
  });

  describe('findByTags', () => {
    beforeEach(async () => {
      await repo.create({ ...testMiner, id: 'miner-001', tags: ['production', 'rack-1'] });
      await repo.create({ ...testMiner, id: 'miner-002', tags: ['staging', 'rack-1'] });
      await repo.create({ ...testMiner, id: 'miner-003', tags: ['production', 'rack-2'] });
    });

    it('should find miners matching any tag', async () => {
      const result = await repo.findByTags(['production']);

      expect(result).toHaveLength(2);
    });

    it('should find miners matching multiple tags', async () => {
      const result = await repo.findByTags(['rack-1']);

      expect(result).toHaveLength(2);
    });
  });
});

describe('MinerStatusRepository', () => {
  let minerRepo: IMinerRepository;
  let statusRepo: IMinerStatusRepository;
  let braiins: BraiinsClient;

  const testMiner: MinerRegistrationInput = {
    id: 'miner-001',
    name: 'Test Miner',
    host: '192.168.1.100',
    port: 80,
    username: 'root',
    password: 'testpass',
    useTls: false,
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    braiins = createBraiinsClient({
      defaultTimeout: 1000,
      maxRetries: 1,
      retryDelay: 50,
    });
    minerRepo = createMinerRepository(null);
    statusRepo = createMinerStatusRepository(braiins, minerRepo, null);

    // Create test miner
    await minerRepo.create(testMiner);
  });

  afterEach(() => {
    braiins.disconnectAll();
  });

  describe('getStatus', () => {
    it('should return null for non-existent miner', async () => {
      const status = await statusRepo.getStatus('nonexistent');

      expect(status).toBeNull();
    });

    it('should return offline status on auth failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

      const status = await statusRepo.getStatus(testMiner.id);

      expect(status).not.toBeNull();
      expect(status?.online).toBe(false);
      expect(status?.id).toBe(testMiner.id);
    });

    it('should return online status with data on success', async () => {
      // Mock authentication
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });

      // Mock API responses
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify({
            uid: 'miner-uid',
            hostname: 'miner-001',
            status: 2,
          }),
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () =>
          JSON.stringify({
            hashboards: [
              {
                id: '1',
                stats: { hashrate: { terahash_per_second: 100 } },
                highest_chip_temp: { celsius: 72 },
              },
            ],
          }),
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify([]),
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({}),
      });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ errors: [] }),
      });

      const status = await statusRepo.getStatus(testMiner.id);

      expect(status).not.toBeNull();
      expect(status?.online).toBe(true);
      expect(status?.hashrateThs).toBe(100);
      expect(status?.maxTemperatureCelsius).toBe(72);
    });
  });

  describe('getFleetStatus', () => {
    beforeEach(async () => {
      await minerRepo.create({ ...testMiner, id: 'miner-002', host: '192.168.1.101' });
    });

    it('should aggregate fleet status', async () => {
      // All miners fail (offline)
      mockFetch.mockRejectedValue(new Error('Connection refused'));

      const fleetStatus = await statusRepo.getFleetStatus();

      expect(fleetStatus.total).toBe(2);
      expect(fleetStatus.offline).toBe(2);
      expect(fleetStatus.online).toBe(0);
      expect(fleetStatus.totalHashrateThs).toBe(0);
    });

    it('should filter by tenantId', async () => {
      await minerRepo.update('miner-001', { tenantId: 'tenant-1' });
      await minerRepo.update('miner-002', { tenantId: 'tenant-2' });

      mockFetch.mockRejectedValue(new Error('Connection refused'));

      const fleetStatus = await statusRepo.getFleetStatus('tenant-1');

      expect(fleetStatus.total).toBe(1);
    });
  });

  describe('invalidateStatus', () => {
    it('should complete without error (no cache)', async () => {
      await expect(statusRepo.invalidateStatus(testMiner.id)).resolves.not.toThrow();
    });
  });
});
