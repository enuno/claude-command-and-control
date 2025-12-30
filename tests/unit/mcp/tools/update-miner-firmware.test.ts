/**
 * Update Miner Firmware Tool Unit Tests
 */

import type { BraiinsClient } from '../../../../src/api/braiins';
import type { ToolContext, ToolResult } from '../../../../src/mcp/tools/types';
import { checkFirmwareJobStatusTool, updateMinerFirmwareTool } from '../../../../src/mcp/tools/update-miner-firmware';
import type { MinerRegistration, MinerService, MinerStatusSummary } from '../../../../src/services/miner.service';

/**
 * Extracts text content from tool result safely.
 */
function getResponseText(result: ToolResult): string {
  const firstContent = result.content[0];
  if (firstContent && 'text' in firstContent && typeof firstContent.text === 'string') {
    return firstContent.text;
  }
  return '{}';
}

describe('update_miner_firmware tool', () => {
  let mockContext: ToolContext;
  let mockMiners: MinerRegistration[];
  let mockMinerStatus: MinerStatusSummary;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock miners
    mockMiners = [
      {
        id: 'miner-1',
        name: 'Test Miner 1',
        host: '192.168.1.100',
        username: 'root',
        password: 'admin',
      },
      {
        id: 'miner-2',
        name: 'Test Miner 2',
        host: '192.168.1.101',
        username: 'root',
        password: 'admin',
      },
    ];

    // Setup mock miner status
    mockMinerStatus = {
      id: 'miner-1',
      name: 'Test Miner 1',
      host: '192.168.1.100',
      online: true,
      info: {
        uid: 'test-uid',
        serial_number: 'SN123',
        hostname: 'miner-1',
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
          brand: 'Antminer',
          model: 'S19',
          name: 'Test Miner',
        },
        status: 2,
        system_uptime: 3600,
        system_uptime_s: 3600,
        bosminer_uptime_s: 3600,
      },
      lastUpdated: new Date().toISOString(),
    };

    // Setup mock context with proper types
    const mockMinerService: Partial<MinerService> = {
      getRegisteredMiners: jest.fn().mockResolvedValue(mockMiners),
      getMinerStatus: jest.fn().mockResolvedValue(mockMinerStatus),
      refreshMinerStatus: jest.fn().mockResolvedValue(mockMinerStatus),
    };

    mockContext = {
      minerService: mockMinerService as MinerService,
      braiinsClient: {} as BraiinsClient,
    };
  });

  describe('updateMinerFirmwareTool', () => {
    it('should accept valid firmware update request', async () => {
      const result = await updateMinerFirmwareTool.handler(
        {
          minerIds: ['miner-1'],
          version: '2.0.1',
        },
        mockContext
      );

      const responseText = getResponseText(result);
      const response = JSON.parse(responseText) as { success: boolean; jobId?: string; status?: string; progress?: { total: number } };

      expect(response.success).toBe(true);
      expect(response.jobId).toBeDefined();
      // Job may be 'pending' or 'running' depending on async timing
      expect(['pending', 'running']).toContain(response.status);
      expect(response.progress?.total).toBe(1);
    });

    it('should accept batch firmware update request', async () => {
      const result = await updateMinerFirmwareTool.handler(
        {
          minerIds: ['miner-1', 'miner-2'],
          version: '2.0.1',
        },
        mockContext
      );

      const responseText = getResponseText(result);
      const response = JSON.parse(responseText) as { success: boolean; progress?: { total: number } };

      expect(response.success).toBe(true);
      expect(response.progress?.total).toBe(2);
    });

    it('should reject invalid version format', async () => {
      const result = await updateMinerFirmwareTool.handler(
        {
          minerIds: ['miner-1'],
          version: 'invalid-version',
        },
        mockContext
      );

      const responseText = getResponseText(result);
      const response = JSON.parse(responseText) as { success: boolean; error?: string };

      expect(response.success).toBe(false);
      expect(response.error).toContain('semantic versioning');
      expect(result.isError).toBe(true);
    });

    it('should enforce batch size limit', async () => {
      const tooManyMiners = Array.from({ length: 101 }, (_, i) => `miner-${i}`);

      const result = await updateMinerFirmwareTool.handler(
        {
          minerIds: tooManyMiners,
          version: '2.0.1',
        },
        mockContext
      );

      const responseText = getResponseText(result);
      const response = JSON.parse(responseText) as { success: boolean };

      expect(response.success).toBe(false);
      expect(result.isError).toBe(true);
    });
  });

  describe('checkFirmwareJobStatusTool', () => {
    it('should return error for non-existent job ID', async () => {
      const result = await checkFirmwareJobStatusTool.handler(
        {
          jobId: 'non-existent-job-id',
        },
        mockContext
      );

      const responseText = getResponseText(result);
      const response = JSON.parse(responseText) as { success: boolean; error?: string };

      expect(response.success).toBe(false);
      expect(response.error).toContain('not found');
      expect(result.isError).toBe(true);
    });
  });
});
