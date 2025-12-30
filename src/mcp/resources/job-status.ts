/**
 * Job Status Resource
 *
 * Provides detailed status information for a background job.
 * Supports URI pattern: braiins:///jobs/{jobId}
 *
 * @module mcp/resources/job-status
 */

import type { JobService } from '../../services/job.service';
import type { MCPResourceDefinition, ResourceContent } from './types';

/**
 * Extended resource context that includes job service.
 */
interface JobResourceContext {
  jobService?: JobService;
}

export const jobStatusResource: MCPResourceDefinition = {
  uriTemplate: 'braiins:///jobs/{jobId}',
  name: 'Job Status',
  description: 'Detailed status and progress information for a background job',
  mimeType: 'application/json',

  handler: async (uri: string, context: unknown): Promise<ResourceContent> => {
    try {
      // Extract jobId from URI pattern: braiins:///jobs/{jobId}
      const match = uri.match(/braiins:\/\/\/jobs\/([^/]+)/);
      if (!match?.[1]) {
        return {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            error: 'Invalid URI format',
            expected: 'braiins:///jobs/{jobId}',
            suggestion: 'Provide a valid job ID in the URI',
          }),
        };
      }

      const jobId = match[1];
      const jobContext = context as JobResourceContext;

      if (!jobContext.jobService) {
        return {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            error: 'Job service not available',
            suggestion: 'Job tracking is not enabled on this server',
          }),
        };
      }

      // Get job status from service
      const job = await jobContext.jobService.getJob(jobId);

      if (!job) {
        return {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify({
            error: `Job ${jobId} not found`,
            suggestion: 'Verify the job ID is correct. Jobs may expire after completion.',
          }),
        };
      }

      // Calculate duration if completed
      let duration: string | undefined;
      if (job.completedAt) {
        const startMs = new Date(job.startedAt).getTime();
        const endMs = new Date(job.completedAt).getTime();
        const durationMs = endMs - startMs;
        const durationSec = Math.round(durationMs / 1000);
        duration = `${durationSec}s`;
      }

      // Return full job details (verbose mode for resources)
      return {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify({
          jobId: job.jobId,
          type: job.type,
          status: job.status,
          progress: {
            total: job.progress.total,
            completed: job.progress.completed,
            failed: job.progress.failed,
            percentage: job.progress.percentage,
          },
          startedAt: job.startedAt,
          completedAt: job.completedAt,
          duration,
          errors: job.errors,
          metadata: job.metadata,
        }),
      };
    } catch (error) {
      return {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify({
          error: error instanceof Error ? error.message : 'Failed to get job status',
          suggestion: 'Verify the job ID exists using check_job_status tool',
        }),
      };
    }
  },
};
