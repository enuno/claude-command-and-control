/**
 * Job Service
 *
 * Manages background jobs for long-running operations like firmware updates.
 * Uses in-memory storage (would use Redis or database in production).
 *
 * @module services/job
 */

import { RedisClient, cacheKeys, cacheTTL } from '../cache/redis';
import { createChildLogger } from '../utils/logger';

const serviceLogger = createChildLogger({ module: 'job-service' });

/**
 * Job status enumeration.
 */
export type JobStatusType = 'pending' | 'running' | 'completed' | 'failed';

/**
 * Job error information.
 */
export interface JobError {
  minerId?: string;
  error: string;
  suggestion: string;
  timestamp: string;
}

/**
 * Job progress information.
 */
export interface JobProgress {
  total: number;
  completed: number;
  failed: number;
  percentage: number;
}

/**
 * Complete job information.
 */
export interface Job {
  jobId: string;
  type: string;
  status: JobStatusType;
  progress: JobProgress;
  startedAt: string;
  completedAt?: string;
  errors: JobError[];
  metadata?: Record<string, unknown>;
}

/**
 * Job service interface.
 */
export interface JobService {
  /**
   * Create a new job.
   */
  createJob(type: string, total: number, metadata?: Record<string, unknown>): Promise<Job>;

  /**
   * Get job by ID.
   */
  getJob(jobId: string): Promise<Job | null>;

  /**
   * Update job progress.
   */
  updateProgress(jobId: string, completed: number, failed: number): Promise<void>;

  /**
   * Add error to job.
   */
  addError(jobId: string, error: JobError): Promise<void>;

  /**
   * Mark job as completed.
   */
  completeJob(jobId: string): Promise<void>;

  /**
   * Mark job as failed.
   */
  failJob(jobId: string, error: string): Promise<void>;

  /**
   * List all jobs (for debugging).
   */
  listJobs(): Promise<Job[]>;
}

/**
 * Creates a job service instance.
 *
 * @param cache - Redis cache client (optional)
 * @returns Job service instance
 */
export function createJobService(cache: RedisClient | null): JobService {
  // In-memory job storage (fallback when Redis unavailable)
  const inMemoryJobs = new Map<string, Job>();

  /**
   * Generate unique job ID.
   */
  function generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Store job in cache or memory.
   */
  async function storeJob(job: Job): Promise<void> {
    if (cache) {
      await cache.set(cacheKeys.job(job.jobId), job, cacheTTL.JOB_STATUS);
    } else {
      inMemoryJobs.set(job.jobId, job);
    }
  }

  /**
   * Retrieve job from cache or memory.
   */
  async function retrieveJob(jobId: string): Promise<Job | null> {
    if (cache) {
      return cache.get<Job>(cacheKeys.job(jobId));
    }
    return inMemoryJobs.get(jobId) ?? null;
  }

  return {
    async createJob(type: string, total: number, metadata?: Record<string, unknown>): Promise<Job> {
      const job: Job = {
        jobId: generateJobId(),
        type,
        status: 'pending',
        progress: {
          total,
          completed: 0,
          failed: 0,
          percentage: 0,
        },
        startedAt: new Date().toISOString(),
        errors: [],
        metadata,
      };

      await storeJob(job);

      serviceLogger.info('Job created', {
        jobId: job.jobId,
        type,
        total,
      });

      return job;
    },

    async getJob(jobId: string): Promise<Job | null> {
      return retrieveJob(jobId);
    },

    async updateProgress(jobId: string, completed: number, failed: number): Promise<void> {
      const job = await retrieveJob(jobId);
      if (!job) {
        serviceLogger.warn('Job not found for progress update', { jobId });
        return;
      }

      job.progress.completed = completed;
      job.progress.failed = failed;
      job.progress.percentage = Math.round(((completed + failed) / job.progress.total) * 100);

      // Update status based on progress
      if (job.status === 'pending') {
        job.status = 'running';
      }

      await storeJob(job);

      serviceLogger.debug('Job progress updated', {
        jobId,
        completed,
        failed,
        percentage: job.progress.percentage,
      });
    },

    async addError(jobId: string, error: JobError): Promise<void> {
      const job = await retrieveJob(jobId);
      if (!job) {
        serviceLogger.warn('Job not found for error addition', { jobId });
        return;
      }

      job.errors.push({
        ...error,
        timestamp: new Date().toISOString(),
      });

      await storeJob(job);

      serviceLogger.warn('Job error added', {
        jobId,
        error: error.error,
      });
    },

    async completeJob(jobId: string): Promise<void> {
      const job = await retrieveJob(jobId);
      if (!job) {
        serviceLogger.warn('Job not found for completion', { jobId });
        return;
      }

      job.status = 'completed';
      job.completedAt = new Date().toISOString();

      await storeJob(job);

      serviceLogger.info('Job completed', {
        jobId,
        duration: Date.now() - new Date(job.startedAt).getTime(),
      });
    },

    async failJob(jobId: string, error: string): Promise<void> {
      const job = await retrieveJob(jobId);
      if (!job) {
        serviceLogger.warn('Job not found for failure', { jobId });
        return;
      }

      job.status = 'failed';
      job.completedAt = new Date().toISOString();
      job.errors.push({
        error,
        suggestion: 'Check the job errors for details',
        timestamp: new Date().toISOString(),
      });

      await storeJob(job);

      serviceLogger.error('Job failed', {
        jobId,
        error,
      });
    },

    async listJobs(): Promise<Job[]> {
      if (cache) {
        // In production, would use Redis SCAN pattern
        // For now, return empty array as we don't have a job index
        return [];
      }
      return Array.from(inMemoryJobs.values());
    },
  };
}
