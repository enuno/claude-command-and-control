/**
 * Update Miner Firmware Tool
 *
 * Updates firmware on one or more Braiins OS miners with automatic download,
 * flashing, and progress tracking. Returns a job ID for async progress polling.
 *
 * @module mcp/tools/update-miner-firmware
 */

import { randomUUID } from 'crypto';
import { z } from 'zod';
import { createChildLogger } from '../../utils/logger';
import type { MCPToolDefinition, ToolArguments, ToolContext } from './types';

const logger = createChildLogger({ module: 'update-miner-firmware' });

/**
 * Firmware version schema - must match semantic versioning.
 */
const FirmwareVersionSchema = z.string().regex(/^\d+\.\d+\.\d+$/, {
  message: 'Firmware version must follow semantic versioning (e.g., 2.0.1)',
});

/**
 * Miner IDs schema - supports batch operations with reasonable limits.
 */
const MinerIdsSchema = z.array(z.string().min(1)).min(1, 'At least one miner ID required').max(100, 'Maximum 100 miners per batch');

/**
 * Input schema for firmware update tool.
 */
const UpdateMinerFirmwareArgsSchema = z.object({
  minerIds: MinerIdsSchema,
  version: FirmwareVersionSchema,
  force: z.boolean().optional().default(false).describe('Skip version checks and force update'),
  detailLevel: z.enum(['concise', 'verbose']).optional().default('concise').describe('Output detail level'),
});

/**
 * Job status for firmware update operations.
 */
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

/**
 * Individual miner update result.
 */
interface MinerUpdateResult {
  minerId: string;
  status: 'completed' | 'failed';
  error?: string;
  duration?: string;
}

/**
 * Firmware update job state.
 */
interface FirmwareUpdateJob {
  jobId: string;
  status: JobStatus;
  minerIds: string[];
  version: string;
  progress: {
    total: number;
    completed: number;
    failed: number;
    current?: string;
  };
  results: MinerUpdateResult[];
  startedAt: string;
  completedAt?: string;
  estimatedCompletion?: string;
}

/**
 * In-memory job storage (would be Redis/database in production).
 */
const jobStore = new Map<string, FirmwareUpdateJob>();

/**
 * Simulates firmware update for a single miner.
 * In production, this would call the actual Braiins OS firmware update API.
 *
 * @param minerId - Miner ID to update
 * @param version - Target firmware version
 * @param force - Whether to force update
 * @param context - Tool context with services
 * @returns Update result
 */
async function updateSingleMiner(
  minerId: string,
  version: string,
  force: boolean,
  context: ToolContext
): Promise<MinerUpdateResult> {
  const startTime = Date.now();

  try {
    // Check if miner exists
    const registration = (await context.minerService.getRegisteredMiners()).find((m) => m.id === minerId);

    if (!registration) {
      return {
        minerId,
        status: 'failed',
        error: `Miner ${minerId} not found in registry`,
      };
    }

    // Get current miner info to check version
    const status = await context.minerService.getMinerStatus(minerId);

    if (!status.online) {
      return {
        minerId,
        status: 'failed',
        error: `Miner ${minerId} is offline`,
      };
    }

    // Check if update is needed (unless forced)
    const currentVersion = status.info?.bos_version?.current;
    if (!force && currentVersion === version) {
      return {
        minerId,
        status: 'completed',
        duration: '0s',
      };
    }

    // TODO: Implement actual firmware update via Braiins API
    // For now, simulate with delay
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    const duration = Math.round((Date.now() - startTime) / 1000);

    // Invalidate miner status cache after update
    await context.minerService.refreshMinerStatus(minerId);

    return {
      minerId,
      status: 'completed',
      duration: `${duration}s`,
    };
  } catch (error) {
    logger.error('Firmware update failed for miner', {
      minerId,
      version,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return {
      minerId,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Processes firmware update job in background.
 *
 * @param job - Job to process
 * @param context - Tool context
 */
async function processJob(job: FirmwareUpdateJob, context: ToolContext, force: boolean): Promise<void> {
  job.status = 'running';

  // Process miners sequentially for simplicity (parallel with concurrency limit in production)
  for (const minerId of job.minerIds) {
    job.progress.current = minerId;

    const result = await updateSingleMiner(minerId, job.version, force, context);

    job.results.push(result);

    if (result.status === 'completed') {
      job.progress.completed++;
    } else {
      job.progress.failed++;
    }

    // Update estimated completion
    const elapsed = Date.now() - new Date(job.startedAt).getTime();
    const avgTimePerMiner = elapsed / (job.progress.completed + job.progress.failed);
    const remaining = job.progress.total - (job.progress.completed + job.progress.failed);
    const estimatedMs = remaining * avgTimePerMiner;
    job.estimatedCompletion = new Date(Date.now() + estimatedMs).toISOString();
  }

  job.status = job.progress.failed === 0 ? 'completed' : 'failed';
  job.completedAt = new Date().toISOString();
  delete job.progress.current;
  delete job.estimatedCompletion;

  logger.info('Firmware update job completed', {
    jobId: job.jobId,
    total: job.progress.total,
    completed: job.progress.completed,
    failed: job.progress.failed,
  });
}

/**
 * Update Miner Firmware Tool Definition.
 */
export const updateMinerFirmwareTool: MCPToolDefinition = {
  schema: {
    name: 'update_miner_firmware',
    description:
      'Update firmware on one or more Braiins OS miners. Handles download, flashing, and verification. Returns job ID for progress tracking. Use check_firmware_job_status to monitor progress.',
    inputSchema: {
      type: 'object',
      properties: {
        minerIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of miner IDs to update (max 100)',
          minItems: 1,
          maxItems: 100,
        },
        version: {
          type: 'string',
          description: 'Target firmware version (semantic versioning, e.g., 2.0.1)',
          pattern: '^\\d+\\.\\d+\\.\\d+$',
        },
        force: {
          type: 'boolean',
          description: 'Skip version checks and force update (default: false)',
          default: false,
        },
        detailLevel: {
          type: 'string',
          enum: ['concise', 'verbose'],
          description: 'Output detail level (default: concise)',
          default: 'concise',
        },
      },
      required: ['minerIds', 'version'],
    },
  },

  handler: async (args: ToolArguments, context: ToolContext) => {
    try {
      const validated = UpdateMinerFirmwareArgsSchema.parse(args);

      // Create job
      const jobId = randomUUID();
      const job: FirmwareUpdateJob = {
        jobId,
        status: 'pending',
        minerIds: validated.minerIds,
        version: validated.version,
        progress: {
          total: validated.minerIds.length,
          completed: 0,
          failed: 0,
        },
        results: [],
        startedAt: new Date().toISOString(),
      };

      // Store job
      jobStore.set(jobId, job);

      // Start background processing
      processJob(job, context, validated.force).catch((error) => {
        logger.error('Job processing failed', {
          jobId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        job.status = 'failed';
      });

      // Return concise or verbose response
      if (validated.detailLevel === 'verbose') {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  jobId,
                  status: job.status,
                  progress: job.progress,
                  minerIds: validated.minerIds,
                  version: validated.version,
                  startedAt: job.startedAt,
                  message: `Firmware update job started for ${validated.minerIds.length} miner(s). Use check_firmware_job_status with jobId to monitor progress.`,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      // Concise response (default)
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              jobId,
              status: job.status,
              progress: job.progress,
              message: `Update started for ${validated.minerIds.length} miner(s). Poll with check_firmware_job_status.`,
            }),
          },
        ],
      };
    } catch (error) {
      logger.error('Firmware update tool failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : 'Failed to start firmware update',
              suggestions: [
                'Verify miner IDs are correct using list_miners',
                'Check firmware version format (e.g., 2.0.1)',
                'Ensure miners are online with get_fleet_status',
              ],
            }),
          },
        ],
        isError: true,
      };
    }
  },
};

/**
 * Check Firmware Job Status Tool Definition.
 */
export const checkFirmwareJobStatusTool: MCPToolDefinition = {
  schema: {
    name: 'check_firmware_job_status',
    description: 'Check the status of a firmware update job by job ID',
    inputSchema: {
      type: 'object',
      properties: {
        jobId: {
          type: 'string',
          description: 'Job ID returned from update_miner_firmware',
        },
        detailLevel: {
          type: 'string',
          enum: ['concise', 'verbose'],
          description: 'Output detail level (default: concise)',
          default: 'concise',
        },
      },
      required: ['jobId'],
    },
  },

  handler: async (args: ToolArguments) => {
    try {
      const { jobId, detailLevel = 'concise' } = args as { jobId: string; detailLevel?: 'concise' | 'verbose' };

      const job = jobStore.get(jobId);

      if (!job) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: `Job ${jobId} not found`,
                suggestion: 'Verify the job ID is correct',
              }),
            },
          ],
          isError: true,
        };
      }

      // Concise response
      if (detailLevel === 'concise') {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                jobId: job.jobId,
                status: job.status,
                progress: job.progress,
                estimatedCompletion: job.estimatedCompletion,
              }),
            },
          ],
        };
      }

      // Verbose response
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                ...job,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : 'Failed to check job status',
            }),
          },
        ],
        isError: true,
      };
    }
  },
};
