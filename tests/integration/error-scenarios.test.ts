/**
 * Integration Tests - Error Scenarios
 *
 * Tests error handling, retry logic, and recovery behavior
 * across the Braiins API client and MinerService integration.
 */

import { createBraiinsClient, BraiinsClient, BraiinsApiError } from '../../src/api/braiins/client';
import { UnauthorizedError, MinerNotFoundError } from '../../src/utils/errors';
import { createMinerService, MinerService } from '../../src/services/miner.service';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Error Scenarios Integration', () => {
  let braiinsClient: BraiinsClient;
  let minerService: MinerService;

  const testMiner = {
    id: 'test-miner-001',
    name: 'Test Miner',
    host: '192.168.1.100',
    port: 80,
    username: 'root',
    password: 'test123',
    useTls: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    braiinsClient = createBraiinsClient({
      defaultTimeout: 1000,
      maxRetries: 2,
      retryDelay: 50, // Fast retries for testing
    });
    minerService = createMinerService(braiinsClient, null);
  });

  afterEach(() => {
    braiinsClient.disconnectAll();
  });

  // ==================== Network Failure Scenarios ====================

  describe('Network Failures', () => {
    it('should handle connection refused error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));

      await expect(braiinsClient.authenticate(testMiner)).rejects.toThrow();
    });

    it('should handle DNS resolution failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('ENOTFOUND'));

      await expect(braiinsClient.authenticate(testMiner)).rejects.toThrow();
    });

    it('should handle timeout on connect', async () => {
      // Simulate timeout by never resolving
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error('AbortError: The operation was aborted')), 100);
          })
      );

      await expect(braiinsClient.authenticate(testMiner)).rejects.toThrow();
    });

    it('should handle network interruption mid-request', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network request failed'));

      await expect(braiinsClient.authenticate(testMiner)).rejects.toThrow();
    });
  });

  // ==================== Authentication Error Scenarios ====================

  describe('Authentication Errors', () => {
    it('should handle invalid credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Invalid credentials',
      });

      await expect(braiinsClient.authenticate(testMiner)).rejects.toThrow(UnauthorizedError);
      expect(braiinsClient.isAuthenticated(testMiner.host)).toBe(false);
    });

    it('should handle expired token during API call', async () => {
      // First authenticate successfully
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'valid-token', timeout_s: 3600 }),
      });
      await braiinsClient.authenticate(testMiner);

      // Then fail with expired token
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Token expired',
      });

      await expect(braiinsClient.getMinerInfo(testMiner.host)).rejects.toThrow(UnauthorizedError);
    });

    it('should handle forbidden access (403)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });
      await braiinsClient.authenticate(testMiner);

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: async () => 'Forbidden',
      });

      await expect(braiinsClient.getMinerInfo(testMiner.host)).rejects.toThrow(BraiinsApiError);
    });
  });

  // ==================== Retry Behavior Scenarios ====================

  describe('Retry Behavior', () => {
    it('should retry on 500 server error and succeed', async () => {
      // Auth succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });
      await braiinsClient.authenticate(testMiner);

      // First call fails, retry succeeds
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          text: async () => 'Internal Server Error',
        })
        .mockResolvedValueOnce({
          ok: true,
          text: async () => JSON.stringify({ uid: 'miner-123' }),
        });

      const result = await braiinsClient.getMinerInfo(testMiner.host);
      expect(result.uid).toBe('miner-123');
      expect(mockFetch).toHaveBeenCalledTimes(3); // 1 auth + 2 getMinerInfo
    });

    it('should retry on 502 Bad Gateway', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });
      await braiinsClient.authenticate(testMiner);

      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 502,
          text: async () => 'Bad Gateway',
        })
        .mockResolvedValueOnce({
          ok: true,
          text: async () => JSON.stringify({ uid: 'miner-123' }),
        });

      const result = await braiinsClient.getMinerInfo(testMiner.host);
      expect(result.uid).toBe('miner-123');
    });

    it('should retry on 503 Service Unavailable', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });
      await braiinsClient.authenticate(testMiner);

      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 503,
          text: async () => 'Service Unavailable',
        })
        .mockResolvedValueOnce({
          ok: true,
          text: async () => JSON.stringify({ uid: 'miner-123' }),
        });

      const result = await braiinsClient.getMinerInfo(testMiner.host);
      expect(result.uid).toBe('miner-123');
    });

    it('should fail after max retries exhausted', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });
      await braiinsClient.authenticate(testMiner);

      // All attempts fail
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Persistent Error',
      });

      await expect(braiinsClient.getMinerInfo(testMiner.host)).rejects.toThrow(BraiinsApiError);
      // 1 auth + 3 attempts (initial + 2 retries)
      expect(mockFetch).toHaveBeenCalledTimes(4);
    });

    it('should NOT retry on 4xx client errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });
      await braiinsClient.authenticate(testMiner);

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad Request',
      });

      await expect(braiinsClient.getMinerInfo(testMiner.host)).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(2); // 1 auth + 1 failed (no retry)
    });
  });

  // ==================== MinerService Error Handling ====================

  describe('MinerService Error Recovery', () => {
    it('should handle unregistered miner gracefully', async () => {
      await expect(minerService.getMinerStatus('nonexistent-miner')).rejects.toThrow(MinerNotFoundError);
    });

    it('should mark miner offline when API fails', async () => {
      // Register the miner
      await minerService.registerMiner(testMiner);

      // Auth fails
      mockFetch.mockRejectedValue(new Error('Network error'));

      const status = await minerService.getMinerStatus(testMiner.id);

      expect(status.online).toBe(false);
      expect(status.id).toBe(testMiner.id);
      expect(status.lastUpdated).toBeDefined();
    });

    it('should calculate fleet status with offline miners', async () => {
      // Register two miners
      await minerService.registerMiner(testMiner);
      await minerService.registerMiner({
        ...testMiner,
        id: 'test-miner-002',
        host: '192.168.1.101',
      });

      // All API calls fail
      mockFetch.mockRejectedValue(new Error('Network error'));

      const fleetStatus = await minerService.getFleetStatus();

      expect(fleetStatus.totalMiners).toBe(2);
      expect(fleetStatus.offlineMiners).toBe(2);
      expect(fleetStatus.onlineMiners).toBe(0);
      expect(fleetStatus.totalHashrateThs).toBe(0);
    });

    it('should handle partial fleet failures', async () => {
      // Register two miners
      await minerService.registerMiner(testMiner);
      await minerService.registerMiner({
        ...testMiner,
        id: 'test-miner-002',
        host: '192.168.1.101',
      });

      // First miner succeeds, second fails
      mockFetch
        // Miner 1 auth
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ token: 'token1', timeout_s: 3600 }),
        })
        // Miner 1 info
        .mockResolvedValueOnce({
          ok: true,
          text: async () => JSON.stringify({ uid: 'miner-1' }),
        })
        // Miner 1 hashboards
        .mockResolvedValueOnce({
          ok: true,
          text: async () =>
            JSON.stringify({
              hashboards: [
                {
                  id: '1',
                  stats: { hashrate: { terahash_per_second: 100 } },
                  highest_chip_temp: { celsius: 65 },
                },
              ],
            }),
        })
        // Miner 1 pools
        .mockResolvedValueOnce({
          ok: true,
          text: async () => JSON.stringify([]),
        })
        // Miner 1 tuner
        .mockResolvedValueOnce({
          ok: true,
          text: async () => JSON.stringify({}),
        })
        // Miner 1 errors
        .mockResolvedValueOnce({
          ok: true,
          text: async () => JSON.stringify({ errors: [] }),
        })
        // Miner 2 auth fails
        .mockRejectedValue(new Error('Connection refused'));

      const fleetStatus = await minerService.getFleetStatus();

      expect(fleetStatus.totalMiners).toBe(2);
      expect(fleetStatus.onlineMiners).toBe(1);
      expect(fleetStatus.offlineMiners).toBe(1);
      expect(fleetStatus.totalHashrateThs).toBe(100);
    });
  });

  // ==================== Malformed Response Scenarios ====================

  describe('Malformed Responses', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });
      await braiinsClient.authenticate(testMiner);
    });

    it('should handle empty response body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => '',
      });

      await expect(braiinsClient.getMinerInfo(testMiner.host)).rejects.toThrow();
    });

    it('should handle invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => 'not valid json {{{',
      });

      await expect(braiinsClient.getMinerInfo(testMiner.host)).rejects.toThrow();
    });

    it('should handle HTML error page response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => '<html><body>Error Page</body></html>',
      });

      await expect(braiinsClient.getMinerInfo(testMiner.host)).rejects.toThrow();
    });
  });

  // ==================== Session Management Scenarios ====================

  describe('Session Management', () => {
    it('should handle multiple miners with independent sessions', async () => {
      const miner1 = { ...testMiner, host: '192.168.1.100' };
      const miner2 = { ...testMiner, host: '192.168.1.101' };

      // Auth for both miners
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ token: 'token1', timeout_s: 3600 }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ token: 'token2', timeout_s: 3600 }),
        });

      await braiinsClient.authenticate(miner1);
      await braiinsClient.authenticate(miner2);

      expect(braiinsClient.isAuthenticated(miner1.host)).toBe(true);
      expect(braiinsClient.isAuthenticated(miner2.host)).toBe(true);

      // Disconnect one should not affect the other
      braiinsClient.disconnect(miner1.host);

      expect(braiinsClient.isAuthenticated(miner1.host)).toBe(false);
      expect(braiinsClient.isAuthenticated(miner2.host)).toBe(true);
    });

    it('should clear all sessions on disconnectAll', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });

      await braiinsClient.authenticate({ ...testMiner, host: '192.168.1.100' });
      await braiinsClient.authenticate({ ...testMiner, host: '192.168.1.101' });
      await braiinsClient.authenticate({ ...testMiner, host: '192.168.1.102' });

      braiinsClient.disconnectAll();

      expect(braiinsClient.isAuthenticated('192.168.1.100')).toBe(false);
      expect(braiinsClient.isAuthenticated('192.168.1.101')).toBe(false);
      expect(braiinsClient.isAuthenticated('192.168.1.102')).toBe(false);
    });
  });

  // ==================== Concurrent Request Scenarios ====================

  describe('Concurrent Requests', () => {
    it('should handle concurrent requests to same miner', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });
      await braiinsClient.authenticate(testMiner);

      // Multiple concurrent requests
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => JSON.stringify({ uid: 'result-1' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          text: async () =>
            JSON.stringify({
              hashboards: [{ id: '1', chip_type: 'BM1397' }],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          text: async () => JSON.stringify([{ uid: 'pool-1', pools: [] }]),
        });

      const [info, hashboards, pools] = await Promise.all([braiinsClient.getMinerInfo(testMiner.host), braiinsClient.getHashboards(testMiner.host), braiinsClient.getPools(testMiner.host)]);

      expect(info.uid).toBe('result-1');
      expect(hashboards.hashboards[0]!.chip_type).toBe('BM1397');
      expect(pools[0]!.uid).toBe('pool-1');
    });

    it('should handle mixed success/failure in concurrent requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'token', timeout_s: 3600 }),
      });
      await braiinsClient.authenticate(testMiner);

      // One succeeds, one fails
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => JSON.stringify({ uid: 'result-1' }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          text: async () => 'Server Error',
        })
        // Retry for failed request
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          text: async () => 'Server Error',
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          text: async () => 'Server Error',
        });

      const results = await Promise.allSettled([braiinsClient.getMinerInfo(testMiner.host), braiinsClient.getHashboards(testMiner.host)]);

      expect(results[0].status).toBe('fulfilled');
      expect(results[1].status).toBe('rejected');
    });
  });
});
