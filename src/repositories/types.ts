/**
 * Repository Types and Interfaces
 *
 * Defines the contracts for data access patterns used throughout the application.
 * Follows the Repository Pattern to abstract data access from business logic.
 *
 * @module repositories/types
 */

import { z } from 'zod';
import type { MinerInfo, HashboardsResponse, PoolsResponse, TunerStateResponse, ErrorsResponse } from '../api/braiins/types';

// ============================================================
// Validation Schemas
// ============================================================

/**
 * Miner registration input schema.
 */
export const MinerRegistrationSchema = z.object({
  id: z.string().min(1, 'Miner ID is required').max(64),
  name: z.string().min(1, 'Miner name is required').max(128),
  host: z.string().min(1, 'Host is required').ip({ version: 'v4', message: 'Must be a valid IPv4 address' }).or(z.string().min(1).max(255)),
  port: z.number().int().min(1).max(65535).optional().default(80),
  username: z.string().min(1).max(64).optional().default('root'),
  password: z.string().min(1, 'Password is required').max(128),
  useTls: z.boolean().optional().default(false),
  tenantId: z.string().max(64).optional(),
  tags: z.array(z.string().max(32)).max(10).optional().default([]),
});

/**
 * Miner filter schema for querying miners.
 */
export const MinerFilterSchema = z.object({
  status: z.enum(['online', 'offline', 'all']).optional().default('all'),
  tenantId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  minHashrateThs: z.number().min(0).optional(),
  maxHashrateThs: z.number().min(0).optional(),
  pool: z.string().optional(),
  firmware: z.string().optional(),
  model: z.string().optional(),
});

/**
 * Pagination schema.
 */
export const PaginationSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
  sortBy: z.enum(['name', 'host', 'status', 'hashrate', 'temperature']).optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

/**
 * Miner ID parameter schema.
 */
export const MinerIdSchema = z.object({
  minerId: z.string().min(1, 'Miner ID is required'),
});

/**
 * Power target schema.
 */
export const PowerTargetSchema = z.object({
  watts: z.number().int().min(100).max(10000, 'Power must be between 100W and 10000W'),
});

/**
 * Hashrate target schema.
 */
export const HashrateTargetSchema = z.object({
  terahashPerSecond: z.number().min(1).max(1000, 'Hashrate must be between 1 and 1000 TH/s'),
});

// ============================================================
// Type Exports from Schemas
// ============================================================

// Use z.input<> for input types to make .optional() fields truly optional (before defaults)
export type MinerRegistrationInput = z.input<typeof MinerRegistrationSchema>;
export type MinerFilter = z.input<typeof MinerFilterSchema>;
export type Pagination = z.input<typeof PaginationSchema>;
export type PowerTargetInput = z.infer<typeof PowerTargetSchema>;
export type HashrateTargetInput = z.infer<typeof HashrateTargetSchema>;

// ============================================================
// Domain Models
// ============================================================

/**
 * Miner entity stored in the repository.
 */
export interface MinerEntity {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  useTls: boolean;
  tenantId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Miner status from real-time API.
 */
export interface MinerStatus {
  id: string;
  name: string;
  host: string;
  online: boolean;
  info?: MinerInfo;
  hashboards?: HashboardsResponse;
  pools?: PoolsResponse;
  tunerState?: TunerStateResponse;
  errors?: ErrorsResponse;
  hashrateThs: number;
  maxTemperatureCelsius: number;
  powerWatts: number;
  lastUpdated: Date;
}

/**
 * Paginated result wrapper.
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Fleet aggregated status.
 */
export interface FleetStatus {
  total: number;
  online: number;
  offline: number;
  totalHashrateThs: number;
  avgTemperatureCelsius: number;
  totalPowerWatts: number;
  errors: number;
  miners: MinerStatus[];
  calculatedAt: Date;
}

// ============================================================
// Repository Interface
// ============================================================

/**
 * Miner repository interface.
 * Abstracts data access for miner entities.
 */
export interface IMinerRepository {
  // CRUD Operations
  create(input: MinerRegistrationInput): Promise<MinerEntity>;
  findById(id: string): Promise<MinerEntity | null>;
  findAll(filter?: MinerFilter, pagination?: Pagination): Promise<PaginatedResult<MinerEntity>>;
  update(id: string, input: Partial<MinerRegistrationInput>): Promise<MinerEntity>;
  delete(id: string): Promise<void>;

  // Existence checks
  exists(id: string): Promise<boolean>;

  // Batch operations
  findByIds(ids: string[]): Promise<MinerEntity[]>;
  findByTenant(tenantId: string): Promise<MinerEntity[]>;
  findByTags(tags: string[]): Promise<MinerEntity[]>;
}

/**
 * Miner status repository interface.
 * Handles real-time status data access.
 */
export interface IMinerStatusRepository {
  getStatus(minerId: string): Promise<MinerStatus | null>;
  getStatuses(minerIds: string[]): Promise<Map<string, MinerStatus>>;
  getFleetStatus(tenantId?: string): Promise<FleetStatus>;
  invalidateStatus(minerId: string): Promise<void>;
}
