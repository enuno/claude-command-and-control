/**
 * Braiins API Client Unit Tests
 */

import { createBraiinsClient, BraiinsClient, BraiinsApiError } from '../../../src/api/braiins/client';
import { UnauthorizedError } from '../../../src/utils/errors';
import type { MinerConnectionConfig, MinerInfo, HashboardsResponse, PoolsResponse } from '../../../src/api/braiins/types';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('BraiinsClient', () => {
  let client: BraiinsClient;

  const testConfig: MinerConnectionConfig = {
    host: '192.168.1.100',
    port: 80,
    username: 'root',
    password: 'test123',
    useTls: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    client = createBraiinsClient({
      defaultTimeout: 5000,
      maxRetries: 2,
      retryDelay: 100,
    });
  });

  afterEach(() => {
    client.disconnectAll();
  });

  // ==================== Authentication ====================

  describe('authenticate', () => {
    it('should authenticate successfully and store session', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          token: 'test-token-123',
          timeout_s: 3600,
        }),
      });

      const token = await client.authenticate(testConfig);

      expect(token).toBe('test-token-123');
      expect(client.isAuthenticated(testConfig.host)).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://192.168.1.100:80/api/v1/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'root',
            password: 'test123',
          }),
        })
      );
    });

    it('should throw UnauthorizedError on auth failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(client.authenticate(testConfig)).rejects.toThrow(UnauthorizedError);
      expect(client.isAuthenticated(testConfig.host)).toBe(false);
    });

    it('should use HTTPS when useTls is true', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });

      const tlsConfig = { ...testConfig, useTls: true, port: 443 };
      await client.authenticate(tlsConfig);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://192.168.1.100:443/api/v1/login',
        expect.any(Object)
      );
    });
  });

  describe('isAuthenticated', () => {
    it('should return false for unknown host', () => {
      expect(client.isAuthenticated('unknown-host')).toBe(false);
    });

    it('should return true after successful auth', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });

      await client.authenticate(testConfig);
      expect(client.isAuthenticated(testConfig.host)).toBe(true);
    });
  });

  // ==================== Miner Information ====================

  describe('getMinerInfo', () => {
    beforeEach(async () => {
      // Authenticate first
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });
      await client.authenticate(testConfig);
    });

    it('should fetch miner info successfully', async () => {
      const mockMinerInfo: MinerInfo = {
        uid: 'miner-123',
        serial_number: 'SN123456',
        hostname: 'miner-01',
        mac_address: '00:11:22:33:44:55',
        platform: 1,
        bos_mode: 1,
        bos_version: {
          current: '1.0.0',
          major: 1,
          minor: 0,
          patch: 0,
        },
        kernel_version: '5.10.0',
        control_board_soc_family: 1,
        miner_identity: {
          brand: 'Bitmain',
          model: 'S19',
          name: 'Antminer S19',
        },
        status: 2, // Running
        system_uptime: 86400,
        system_uptime_s: 86400,
        bosminer_uptime_s: 3600,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockMinerInfo),
      });

      const result = await client.getMinerInfo(testConfig.host);

      expect(result).toEqual(mockMinerInfo);
      expect(mockFetch).toHaveBeenLastCalledWith(
        'http://192.168.1.100:80/api/v1/info',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer token',
          }),
        })
      );
    });

    it('should throw UnauthorizedError on 401', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      });

      await expect(client.getMinerInfo(testConfig.host)).rejects.toThrow(UnauthorizedError);
    });

    it('should retry on server error', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          text: async () => 'Server Error',
        })
        .mockResolvedValueOnce({
          ok: true,
          text: async () => JSON.stringify({ uid: 'miner-123' }),
        });

      const result = await client.getMinerInfo(testConfig.host);

      expect(result.uid).toBe('miner-123');
      expect(mockFetch).toHaveBeenCalledTimes(3); // 1 auth + 2 getMinerInfo
    });
  });

  describe('getErrors', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });
      await client.authenticate(testConfig);
    });

    it('should fetch errors list', async () => {
      const mockErrors = {
        errors: [
          {
            message: 'Temperature warning',
            timestamp: '2025-01-01T00:00:00Z',
            components: [{ name: 'hashboard', index: 1 }],
            error_codes: [{ code: 'TEMP_HIGH', reason: 'Temperature exceeded threshold' }],
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockErrors),
      });

      const result = await client.getErrors(testConfig.host);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]!.message).toBe('Temperature warning');
    });
  });

  // ==================== Hashboards ====================

  describe('getHashboards', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });
      await client.authenticate(testConfig);
    });

    it('should fetch hashboards successfully', async () => {
      const mockHashboards: HashboardsResponse = {
        hashboards: [
          {
            id: '1',
            board_name: 'Board 1',
            model: 'S19',
            enabled: true,
            chip_type: 'BM1397',
            chips_count: 76,
            board_temp: { celsius: 55 },
            highest_chip_temp: { celsius: 72 },
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockHashboards),
      });

      const result = await client.getHashboards(testConfig.host);

      expect(result.hashboards).toHaveLength(1);
      expect(result.hashboards[0]!.chip_type).toBe('BM1397');
    });
  });

  // ==================== Pools ====================

  describe('getPools', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });
      await client.authenticate(testConfig);
    });

    it('should fetch pools successfully', async () => {
      const mockPools: PoolsResponse = [
        {
          uid: 'group1',
          name: 'Primary Pool',
          pools: [
            {
              uid: 'pool1',
              url: 'stratum+tcp://pool.example.com:3333',
              user: 'worker1',
              enabled: true,
              active: true,
              alive: true,
              stats: {
                accepted_shares: 1000,
                rejected_shares: 10,
                stale_shares: 5,
                best_share: 12345,
                last_difficulty: 65536,
                generated_work: 5000,
              },
            },
          ],
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockPools),
      });

      const result = await client.getPools(testConfig.host);

      expect(result).toHaveLength(1);
      expect(result[0]!.pools[0]!.url).toBe('stratum+tcp://pool.example.com:3333');
    });
  });

  // ==================== Performance ====================

  describe('setPowerTarget', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });
      await client.authenticate(testConfig);
    });

    it('should set power target successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify({ watt: 3000 }),
      });

      const result = await client.setPowerTarget(testConfig.host, { watt: 3000 });

      expect(result.watt).toBe(3000);
      expect(mockFetch).toHaveBeenLastCalledWith(
        'http://192.168.1.100:80/api/v1/performance/power-target',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ watt: 3000 }),
        })
      );
    });
  });

  // ==================== System Operations ====================

  describe('reboot', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });
      await client.authenticate(testConfig);
    });

    it('should send reboot command', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => '',
      });

      await expect(client.reboot(testConfig.host)).resolves.not.toThrow();
    });
  });

  // ==================== Session Management ====================

  describe('disconnect', () => {
    it('should remove session for host', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });
      await client.authenticate(testConfig);

      expect(client.isAuthenticated(testConfig.host)).toBe(true);

      client.disconnect(testConfig.host);

      expect(client.isAuthenticated(testConfig.host)).toBe(false);
    });
  });

  describe('disconnectAll', () => {
    it('should remove all sessions', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });

      await client.authenticate(testConfig);
      await client.authenticate({ ...testConfig, host: '192.168.1.101' });

      expect(client.isAuthenticated(testConfig.host)).toBe(true);
      expect(client.isAuthenticated('192.168.1.101')).toBe(true);

      client.disconnectAll();

      expect(client.isAuthenticated(testConfig.host)).toBe(false);
      expect(client.isAuthenticated('192.168.1.101')).toBe(false);
    });
  });

  // ==================== Error Handling ====================

  describe('error handling', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });
      await client.authenticate(testConfig);
    });

    it('should throw BraiinsApiError after max retries', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 502,
        text: async () => 'Bad Gateway',
      });

      await expect(client.getMinerInfo(testConfig.host)).rejects.toThrow(BraiinsApiError);
    });

    it('should not retry on 4xx errors (except 401)', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          text: async () => 'Bad Request',
        });

      await expect(client.getMinerInfo(testConfig.host)).rejects.toThrow();
      // 1 auth + 1 failed request (no retries for 4xx)
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
