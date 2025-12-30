/**
 * MCP Prompts Integration Tests
 *
 * Tests the prompt workflows to ensure they generate proper multi-turn conversations
 * with actionable guidance and tool recommendations.
 */

import type { BraiinsClient } from '../../../../src/api/braiins';
import { batchFirmwareUpdatePrompt } from '../../../../src/mcp/prompts/batch-firmware-update';
import { optimizePowerEfficiencyPrompt } from '../../../../src/mcp/prompts/optimize-power-efficiency';
import { troubleshootMinerOfflinePrompt } from '../../../../src/mcp/prompts/troubleshoot-miner-offline';
import type { PromptContext } from '../../../../src/mcp/prompts/types';
import type {
  FleetStatusSummary,
  MinerService,
  MinerStatusSummary,
} from '../../../../src/services/miner.service';

describe('MCP Prompts Integration Tests', () => {
  let mockContext: PromptContext;
  let mockMinerStatus: MinerStatusSummary;
  let mockFleetStatus: FleetStatusSummary;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock miner status (online miner)
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
          current: '1.9.0',
          major: 1,
          minor: 9,
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
      hashboards: {
        hashboards: [
          {
            id: 'hb-1',
            board_name: 'Hashboard 1',
            model: 'S19',
            enabled: true,
            chip_type: 'BM1397',
            chips_count: 126,
            current_voltage: { millivolt: 1200 },
            current_frequency: { mhz: 650 },
            highest_chip_temp: { celsius: 65 },
            stats: {
              accepted_shares: 1000,
              rejected_shares: 5,
              hardware_errors: 0,
              hashrate: {
                gigahash_per_second: 33000,
              },
            },
          },
        ],
      },
      pools: [
        {
          uid: 'pool-group-1',
          name: 'Default Pool Group',
          pools: [
            {
              uid: 'pool-1',
              url: 'stratum+tcp://pool.example.com:3333',
              user: 'user.worker1',
              enabled: true,
              active: true,
              alive: true,
              stats: {
                accepted_shares: 1000,
                rejected_shares: 5,
                stale_shares: 2,
                best_share: 1000000,
                last_difficulty: 10000,
                generated_work: 1000,
              },
            },
          ],
        },
      ],
      tunerState: {
        overall_tuner_state: 2, // Stable
        mode_state: {
          powertargetmodestate: {
            current_target: { watt: 3250 },
          },
        },
      },
      lastUpdated: new Date().toISOString(),
    };

    // Setup mock fleet status
    mockFleetStatus = {
      totalMiners: 3,
      onlineMiners: 2,
      offlineMiners: 1,
      totalHashrateThs: 99,
      avgTemperatureCelsius: 65,
      totalPowerWatts: 9750,
      miners: [
        mockMinerStatus,
        {
          ...mockMinerStatus,
          id: 'miner-2',
          name: 'Test Miner 2',
          host: '192.168.1.101',
        },
        {
          ...mockMinerStatus,
          id: 'miner-3',
          name: 'Test Miner 3',
          host: '192.168.1.102',
          online: false,
        },
      ],
      calculatedAt: new Date().toISOString(),
    };

    // Setup mock context
    const mockMinerService: Partial<MinerService> = {
      getMinerStatus: jest.fn().mockResolvedValue(mockMinerStatus),
      getFleetStatus: jest.fn().mockResolvedValue(mockFleetStatus),
    };

    mockContext = {
      minerService: mockMinerService as MinerService,
      braiinsClient: {} as BraiinsClient,
    };
  });

  describe('troubleshoot_miner_offline prompt', () => {
    it('should generate diagnostic workflow for online miner', async () => {
      const result = await troubleshootMinerOfflinePrompt.handler(
        { minerId: 'miner-1' },
        mockContext
      );

      expect(result).toHaveLength(2);
      expect(result[0].role).toBe('user');
      expect(result[1].role).toBe('assistant');

      const assistantMessage = result[1].content.text ?? '';
      expect(assistantMessage).toContain('Step 1: Check Last Known Status');
      expect(assistantMessage).toContain('✅ ONLINE');
      expect(assistantMessage).toContain('miner-1');
      expect(assistantMessage).toContain('Hardware Info');
      expect(assistantMessage).toContain('Hashboards Status');
    });

    it('should generate diagnostic workflow for offline miner', async () => {
      const offlineMinerStatus = {
        ...mockMinerStatus,
        online: false,
      };

      (mockContext.minerService.getMinerStatus as jest.Mock).mockResolvedValue(
        offlineMinerStatus
      );

      const result = await troubleshootMinerOfflinePrompt.handler(
        { minerId: 'miner-3' },
        mockContext
      );

      expect(result).toHaveLength(2);
      const assistantMessage = result[1].content.text ?? '';
      expect(assistantMessage).toContain('❌ OFFLINE');
      expect(assistantMessage).toContain('Verify Network Connectivity');
      expect(assistantMessage).toContain('Check Physical Connections');
      expect(assistantMessage).toContain('get_miner_info');
    });

    it('should handle miner not found error gracefully', async () => {
      (mockContext.minerService.getMinerStatus as jest.Mock).mockRejectedValue(
        new Error('Miner not found')
      );

      const result = await troubleshootMinerOfflinePrompt.handler(
        { minerId: 'invalid-miner' },
        mockContext
      );

      expect(result).toHaveLength(2);
      const assistantMessage = result[1].content.text ?? '';
      expect(assistantMessage).toContain('Miner not found');
      expect(assistantMessage).toContain('Verify Miner Registration');
      expect(assistantMessage).toContain('get_fleet_status');
      expect(assistantMessage).toContain('register_miner');
    });

    it('should require minerId parameter', async () => {
      const result = await troubleshootMinerOfflinePrompt.handler({}, mockContext);

      expect(result).toHaveLength(1);
      expect(result[0]?.role).toBe('assistant');
      expect(result[0]?.content.text).toContain('minerId is required');
    });
  });

  describe('optimize_power_efficiency prompt', () => {
    it('should generate optimization workflow for online miner', async () => {
      const result = await optimizePowerEfficiencyPrompt.handler(
        { minerId: 'miner-1' },
        mockContext
      );

      expect(result).toHaveLength(2);
      expect(result[0].role).toBe('user');
      expect(result[1].role).toBe('assistant');

      const assistantMessage = result[1].content.text ?? '';
      expect(assistantMessage).toContain('Step 1: Current Performance Analysis');
      expect(assistantMessage).toContain('Current Efficiency');
      expect(assistantMessage).toContain('W/TH');
      expect(assistantMessage).toContain('Step 2: Efficiency Analysis');
      expect(assistantMessage).toContain('Step 3: Optimization Recommendations');
      expect(assistantMessage).toContain('set_power_target');
    });

    it('should support target efficiency parameter', async () => {
      const result = await optimizePowerEfficiencyPrompt.handler(
        { minerId: 'miner-1', targetEfficiency: '30' },
        mockContext
      );

      expect(result).toHaveLength(2);
      const assistantMessage = result[1].content.text ?? '';
      expect(assistantMessage).toContain('Your Target: 30 W/TH');
    });

    it('should handle miner not found error', async () => {
      (mockContext.minerService.getMinerStatus as jest.Mock).mockRejectedValue(
        new Error('Miner not reachable')
      );

      const result = await optimizePowerEfficiencyPrompt.handler(
        { minerId: 'invalid-miner' },
        mockContext
      );

      expect(result).toHaveLength(2);
      const assistantMessage = result[1].content.text ?? '';
      expect(assistantMessage).toContain('Miner not reachable');
      expect(assistantMessage).toContain('Power Efficiency Best Practices');
    });
  });

  describe('batch_firmware_update prompt', () => {
    it('should generate batch update workflow for multiple miners', async () => {
      const result = await batchFirmwareUpdatePrompt.handler(
        { minerIds: 'miner-1,miner-2', version: '2.0.1' },
        mockContext
      );

      expect(result).toHaveLength(2);
      expect(result[0].role).toBe('user');
      expect(result[1].role).toBe('assistant');

      const assistantMessage = result[1].content.text ?? '';
      expect(assistantMessage).toContain('Step 1: Pre-Flight Checks');
      expect(assistantMessage).toContain('Fleet Status');
      expect(assistantMessage).toContain('Total miners selected: 2');
      expect(assistantMessage).toContain('Step 2: Risk Assessment');
      expect(assistantMessage).toContain('Step 3: Execution Plan');
      expect(assistantMessage).toContain('update_miner_firmware');
    });

    it('should support "all" keyword for fleet-wide updates', async () => {
      const result = await batchFirmwareUpdatePrompt.handler(
        { minerIds: 'all', version: '2.0.1' },
        mockContext
      );

      expect(result).toHaveLength(2);
      const assistantMessage = result[1].content.text ?? '';
      expect(assistantMessage).toContain('Total miners selected: 3');
      // Fleet status should include all miners from the mock
      expect(assistantMessage).toContain('Online and ready: 2');
      expect(assistantMessage).toContain('Offline: 1');
    });

    it('should validate firmware version format', async () => {
      const result = await batchFirmwareUpdatePrompt.handler(
        { minerIds: 'miner-1', version: 'invalid-version' },
        mockContext
      );

      expect(result).toHaveLength(1);
      expect(result[0]?.role).toBe('assistant');
      expect(result[0]?.content.text).toContain('Invalid firmware version format');
      expect(result[0]?.content.text).toContain('semantic versioning');
    });

    it('should enforce batch size limit', async () => {
      const manyMiners = Array.from({ length: 101 }, (_, i) => `miner-${i}`).join(',');

      const result = await batchFirmwareUpdatePrompt.handler(
        { minerIds: manyMiners, version: '2.0.1' },
        mockContext
      );

      expect(result).toHaveLength(1);
      expect(result[0]?.content.text).toContain('Batch limit exceeded');
      expect(result[0]?.content.text).toContain('maximum is 100');
    });

    it('should identify offline miners in pre-flight checks', async () => {
      const result = await batchFirmwareUpdatePrompt.handler(
        { minerIds: 'miner-1,miner-2,miner-3', version: '2.0.1' },
        mockContext
      );

      expect(result).toHaveLength(2);
      const assistantMessage = result[1].content.text ?? '';
      expect(assistantMessage).toContain('Offline: 1');
      expect(assistantMessage).toContain('Offline Miners:');
    });

    it('should provide phased rollout recommendations for large batches', async () => {
      const largeFleet = {
        ...mockFleetStatus,
        totalMiners: 50,
        miners: Array.from({ length: 50 }, (_, i) => ({
          ...mockMinerStatus,
          id: `miner-${i}`,
        })),
      };

      (mockContext.minerService.getFleetStatus as jest.Mock).mockResolvedValue(largeFleet);

      const result = await batchFirmwareUpdatePrompt.handler(
        { minerIds: 'all', version: '2.0.1' },
        mockContext
      );

      expect(result).toHaveLength(2);
      const assistantMessage = result[1].content.text ?? '';
      expect(assistantMessage).toContain('Phased Rollout');
      expect(assistantMessage).toContain('Test on 3-5 miners first');
    });

    it('should require both minerIds and version parameters', async () => {
      const result = await batchFirmwareUpdatePrompt.handler(
        { minerIds: 'miner-1' },
        mockContext
      );

      expect(result).toHaveLength(1);
      expect(result[0]?.content.text).toContain('Both minerIds and version are required');
    });
  });

  describe('Prompt metadata validation', () => {
    it('troubleshoot_miner_offline should have correct metadata', () => {
      expect(troubleshootMinerOfflinePrompt.name).toBe('troubleshoot_miner_offline');
      expect(troubleshootMinerOfflinePrompt.description).toContain('diagnose and fix offline miners');
      expect(troubleshootMinerOfflinePrompt.arguments).toHaveLength(1);
      expect(troubleshootMinerOfflinePrompt.arguments?.[0]?.name).toBe('minerId');
      expect(troubleshootMinerOfflinePrompt.arguments?.[0]?.required).toBe(true);
    });

    it('optimize_power_efficiency should have correct metadata', () => {
      expect(optimizePowerEfficiencyPrompt.name).toBe('optimize_power_efficiency');
      expect(optimizePowerEfficiencyPrompt.description).toContain('optimize miner power settings');
      expect(optimizePowerEfficiencyPrompt.arguments).toHaveLength(2);
      expect(optimizePowerEfficiencyPrompt.arguments?.[0]?.name).toBe('minerId');
      expect(optimizePowerEfficiencyPrompt.arguments?.[1]?.name).toBe('targetEfficiency');
      expect(optimizePowerEfficiencyPrompt.arguments?.[1]?.required).toBe(false);
    });

    it('batch_firmware_update should have correct metadata', () => {
      expect(batchFirmwareUpdatePrompt.name).toBe('batch_firmware_update');
      expect(batchFirmwareUpdatePrompt.description).toContain('updating firmware on multiple miners');
      expect(batchFirmwareUpdatePrompt.arguments).toHaveLength(2);
      expect(batchFirmwareUpdatePrompt.arguments?.[0]?.name).toBe('minerIds');
      expect(batchFirmwareUpdatePrompt.arguments?.[1]?.name).toBe('version');
    });
  });
});
