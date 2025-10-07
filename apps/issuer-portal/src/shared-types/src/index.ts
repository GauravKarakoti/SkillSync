/**
 * Main export file for SkillSync shared types
 */

export * from './moca';
export * from './issuance';
export * from './credential'; // Assuming you have this from previous setup

// Common utility types
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
};

export type PaginatedResponse<T = unknown> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}>;

export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };