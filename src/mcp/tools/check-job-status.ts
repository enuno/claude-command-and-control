/**
 * Check Job Status Tool
 *
 * Retrieves the current status and progress of a background job.
 *
 * @module mcp/tools/check-job-status
 */

import { z } from 'zod';
import type { JobService } from '../../services/job.service';
import type { MCPToolDefinition, ToolArguments, ToolContext } from './types';

const CheckJobStatusArgsSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  detailLevel: z.enum(['concise', 'verbose']).optional().default('concise'),
});

/**
 * Extended tool context that includes job service.
 */
interface JobToolContext extends ToolContext {
  jobService: JobService;
}

export const checkJobStatusTool: MCPToolDefinition = {
  schema: {
    name: 'check_job_status',
    description: 'Check the status and progress of a background job (e.g., firmware update, batch operation)',
    inputSchema: {
      type: 'object',
      properties: {
        jobId: {
          type: 'string',
          description: 'The unique identifier of the job to check',
        },
        detailLevel: {
          type: 'string',
          enum: ['concise', 'verbose'],
          description: 'Level of detail to return (default: concise)',
        },
      },
      required: ['jobId'],
    },
  },

  handler: async (args: ToolArguments, context: ToolContext) => {
    try {
      const validated = CheckJobStatusArgsSchema.parse(args);
      const jobContext = context as unknown as JobToolContext;

      if (!jobContext.jobService) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: 'Job service not available',
                suggestion: 'Job tracking is not enabled on this server',
              }),
            },
          ],
          isError: true,
        };
      }

      const job = await jobContext.jobService.getJob(validated.jobId);

      if (!job) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: `Job ${validated.jobId} not found`,
                suggestion: 'Verify the job ID is correct. Jobs may expire after completion.',
              }),
            },
          ],
          isError: true,
        };
      }

      // Build concise response by default
      const response: Record<string, unknown> = {
        success: true,
        jobId: job.jobId,
        type: job.type,
        status: job.status,
        progress: {
          total: job.progress.total,
          completed: job.progress.completed,
          failed: job.progress.failed,
          percentage: job.progress.percentage,
        },
      };

      // Add completion time if available
      if (job.completedAt) {
        response.completedAt = job.completedAt;

        // Calculate duration
        const startMs = new Date(job.startedAt).getTime();
        const endMs = new Date(job.completedAt).getTime();
        const durationMs = endMs - startMs;
        const durationSec = Math.round(durationMs / 1000);
        response.duration = `${durationSec}s`;
      }

      // Add errors if any (always show in concise mode if failed)
      if (job.errors.length > 0) {
        if (validated.detailLevel === 'verbose') {
          response.errors = job.errors;
        } else {
          // Just show count in concise mode
          response.errorCount = job.errors.length;
          response.recentError = job.errors[job.errors.length - 1]?.error;
        }
      }

      // Add verbose details if requested
      if (validated.detailLevel === 'verbose') {
        response.startedAt = job.startedAt;
        response.metadata = job.metadata;
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response),
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
              suggestion: 'Verify the job ID format is correct',
            }),
          },
        ],
        isError: true,
      };
    }
  },
};
