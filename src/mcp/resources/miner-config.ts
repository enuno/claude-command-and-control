/**
 * Miner Configuration Resource
 *
 * Provides complete miner configuration including pools, tuning, network, and cooling settings.
 * Cached for 60 seconds to reduce load on miners.
 *
 * URI: braiins:///miner/{minerId}/config
 *
 * @module mcp/resources/miner-config
 */

import { TunerState } from '../../api/braiins/types';
import type { MCPResourceDefinition, ResourceContext, ResourceContent } from './types';

export const minerConfigResource: MCPResourceDefinition = {
  uriTemplate: 'braiins:///miner/{minerId}/config',
  name: 'Miner Configuration',
  description: 'Complete miner configuration including pools, tuning settings, network, and cooling (cached for 60s)',
  mimeType: 'application/json',

  handler: async (uri: string, context: ResourceContext): Promise<ResourceContent> => {
    try {
      // Extract minerId from URI pattern: braiins:///miner/{minerId}/config
      const match = uri.match(/braiins:\/\/\/miner\/([^/]+)\/config/);
      if (!match?.[1]) {
        return {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            error: 'Invalid URI format',
            expected: 'braiins:///miner/{minerId}/config',
            suggestion: 'Provide a valid miner ID in the URI',
          }),
        };
      }

      const minerId = match[1];

      // Get miner status which includes configuration data
      const status = await context.minerService.getMinerStatus(minerId);

      // Build comprehensive configuration object
      const config = {
        // Miner Identity
        miner: {
          id: status.id,
          name: status.name,
          host: status.host,
          online: status.online,
          lastUpdated: status.lastUpdated,
        },

        // Hardware Information
        hardware: status.info ? {
          uid: status.info.uid,
          serialNumber: status.info.serial_number,
          hostname: status.info.hostname,
          macAddress: status.info.mac_address,
          platform: status.info.platform,
          identity: {
            brand: status.info.miner_identity.brand,
            model: status.info.miner_identity.model,
            name: status.info.miner_identity.name,
          },
          firmwareVersion: status.info.bos_version.current,
          bosMode: status.info.bos_mode,
          kernelVersion: status.info.kernel_version,
          stickerHashrate: status.info.sticker_hashrate ? {
            terahashPerSecond: status.info.sticker_hashrate.terahash_per_second,
          } : null,
          systemUptime: {
            seconds: status.info.system_uptime_s,
            formatted: `${Math.floor(status.info.system_uptime_s / 86400)}d ${Math.floor((status.info.system_uptime_s % 86400) / 3600)}h`,
          },
          bosminerUptime: {
            seconds: status.info.bosminer_uptime_s,
            formatted: `${Math.floor(status.info.bosminer_uptime_s / 86400)}d ${Math.floor((status.info.bosminer_uptime_s % 86400) / 3600)}h`,
          },
        } : null,

        // Hashboard Configuration
        hashboards: status.hashboards ? {
          count: status.hashboards.hashboards.length,
          boards: status.hashboards.hashboards.map((hb) => ({
            id: hb.id,
            name: hb.board_name,
            model: hb.model,
            serialNumber: hb.serial_number ?? null,
            enabled: hb.enabled,
            chipType: hb.chip_type,
            chipCount: hb.chips_count,
            voltage: hb.current_voltage ? {
              millivolt: hb.current_voltage.millivolt,
              formatted: `${(hb.current_voltage.millivolt / 1000).toFixed(2)}V`,
            } : null,
            frequency: hb.current_frequency ? {
              mhz: hb.current_frequency.mhz,
              formatted: `${hb.current_frequency.mhz}MHz`,
            } : null,
            temperatures: {
              board: hb.board_temp ? {
                celsius: hb.board_temp.celsius,
                formatted: `${hb.board_temp.celsius}°C`,
              } : null,
              lowestInlet: hb.lowest_inlet_temp ? {
                celsius: hb.lowest_inlet_temp.celsius,
                formatted: `${hb.lowest_inlet_temp.celsius}°C`,
              } : null,
              highestOutlet: hb.highest_outlet_temp ? {
                celsius: hb.highest_outlet_temp.celsius,
                formatted: `${hb.highest_outlet_temp.celsius}°C`,
              } : null,
              highestChip: hb.highest_chip_temp ? {
                celsius: hb.highest_chip_temp.celsius,
                formatted: `${hb.highest_chip_temp.celsius}°C`,
              } : null,
            },
            statistics: hb.stats ? {
              acceptedShares: hb.stats.accepted_shares,
              rejectedShares: hb.stats.rejected_shares,
              hardwareErrors: hb.stats.hardware_errors,
              hashrate: hb.stats.hashrate ? {
                gigahashPerSecond: hb.stats.hashrate.gigahash_per_second,
                terahashPerSecond: hb.stats.hashrate.terahash_per_second,
                formatted: hb.stats.hashrate.terahash_per_second
                  ? `${hb.stats.hashrate.terahash_per_second.toFixed(2)} TH/s`
                  : `${(hb.stats.hashrate.gigahash_per_second ?? 0).toFixed(2)} GH/s`,
              } : null,
            } : null,
          })),
        } : null,

        // Pool Configuration
        pools: status.pools ? status.pools.map((group) => ({
          groupId: group.uid,
          groupName: group.name,
          loadBalanceStrategy: group.load_balance_strategy ?? group.strategy,
          pools: group.pools.map((pool) => ({
            uid: pool.uid,
            url: pool.url,
            user: pool.user,
            enabled: pool.enabled,
            active: pool.active ?? false,
            alive: pool.alive ?? false,
            statistics: pool.stats ? {
              acceptedShares: pool.stats.accepted_shares,
              rejectedShares: pool.stats.rejected_shares,
              staleShares: pool.stats.stale_shares,
              bestShare: pool.stats.best_share,
              lastDifficulty: pool.stats.last_difficulty,
              generatedWork: pool.stats.generated_work,
              lastShareTime: pool.stats.last_share_time ? {
                seconds: pool.stats.last_share_time.seconds,
                nanos: pool.stats.last_share_time.nanos,
              } : null,
            } : null,
          })),
        })) : [],

        // Tuner Configuration
        tuner: status.tunerState ? {
          overallState: status.tunerState.overall_tuner_state,
          overallStateDescription: (() => {
            const state = status.tunerState?.overall_tuner_state;
            if (state === undefined) {
              return 'Unknown';
            }
            switch (state) {
              case TunerState.Disabled: return 'Disabled';
              case TunerState.Running: return 'Running';
              case TunerState.Stable: return 'Stable';
              case TunerState.TestingPerformance: return 'Testing Performance';
              default: return 'Unknown';
            }
          })(),
          powerTargetMode: status.tunerState.mode_state?.powertargetmodestate ? {
            currentTarget: {
              watt: status.tunerState.mode_state.powertargetmodestate.current_target.watt,
              formatted: `${status.tunerState.mode_state.powertargetmodestate.current_target.watt}W`,
            },
            profile: status.tunerState.mode_state.powertargetmodestate.profile ? {
              targetPower: {
                watt: status.tunerState.mode_state.powertargetmodestate.profile.target.watt,
              },
              estimatedPowerConsumption: {
                watt: status.tunerState.mode_state.powertargetmodestate.profile.estimated_power_consumption.watt,
              },
              measuredHashrate: status.tunerState.mode_state.powertargetmodestate.profile.measured_hashrate,
              createdAt: {
                seconds: status.tunerState.mode_state.powertargetmodestate.profile.created.seconds,
                nanos: status.tunerState.mode_state.powertargetmodestate.profile.created.nanos,
              },
            } : null,
          } : null,
          hashrateTargetMode: status.tunerState.mode_state?.hashratetargetmodestate ? {
            currentTarget: status.tunerState.mode_state.hashratetargetmodestate.current_target,
            profile: status.tunerState.mode_state.hashratetargetmodestate.profile ? {
              targetPower: {
                watt: status.tunerState.mode_state.hashratetargetmodestate.profile.target.watt,
              },
              estimatedPowerConsumption: {
                watt: status.tunerState.mode_state.hashratetargetmodestate.profile.estimated_power_consumption.watt,
              },
              measuredHashrate: status.tunerState.mode_state.hashratetargetmodestate.profile.measured_hashrate,
              createdAt: {
                seconds: status.tunerState.mode_state.hashratetargetmodestate.profile.created.seconds,
                nanos: status.tunerState.mode_state.hashratetargetmodestate.profile.created.nanos,
              },
            } : null,
          } : null,
        } : null,

        // Error Status
        errors: status.errors ? {
          count: status.errors.errors.length,
          hasErrors: status.errors.errors.length > 0,
          errors: status.errors.errors.map((err) => ({
            message: err.message,
            timestamp: err.timestamp,
            components: err.components.map((c) => ({
              name: c.name,
              index: c.index,
            })),
            errorCodes: err.error_codes.map((ec) => ({
              code: ec.code,
              reason: ec.reason,
              hint: ec.hint ?? null,
            })),
          })),
        } : null,

        // Metadata
        metadata: {
          resourceUri: uri,
          cachedUntil: new Date(Date.now() + 60000).toISOString(), // 60 second cache
          lastUpdated: status.lastUpdated,
        },
      };

      return {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(config, null, 2),
      };
    } catch (error) {
      return {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify({
          error: error instanceof Error ? error.message : 'Failed to get miner configuration',
          suggestion: 'Verify the miner ID is correct and the miner is reachable',
          troubleshooting: [
            'Use get_fleet_status to list all registered miners',
            'Use get_miner_status to check if miner is online',
            'If miner is offline, use troubleshoot_miner_offline prompt',
          ],
        }),
      };
    }
  },
};
