/**
 * Types for credential issuance and issuer management
 * Covers schemas, bulk operations, and issuer analytics
 */

import { CredentialData, VerificationResult } from './moca';

export interface CredentialSchema {
  id: string;
  name: string;
  fields: SchemaField[];
  description: string;
  version: string;
  createdAt: string;
  isActive: boolean;
}

export interface SchemaField {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array';
  required: boolean;
  description?: string;
  validation?: FieldValidation;
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minValue?: number;
  maxValue?: number;
  allowedValues?: any[];
}

export interface IssuanceFormData {
  recipientDid: string;
  credentialData: Record<string, string>;
  schema: string;
  expiration?: number;
  metadata?: {
    batchId?: string;
    externalId?: string;
    notes?: string;
  };
}

export interface BulkIssuanceRecord {
  recipientDid: string;
  data: Record<string, string>;
  status: 'pending' | 'issued' | 'failed';
  error?: string;
  credentialId?: string;
  issuedAt?: string;
}

export interface BulkIssuanceRequest {
  records: BulkIssuanceRecord[];
  schema: string;
  issuerDid: string;
  batchName?: string;
  options?: {
    parallelProcessing?: boolean;
    delayBetweenRequests?: number;
    stopOnFailure?: boolean;
  };
}

export interface BulkIssuanceResult {
  batchId: string;
  totalRecords: number;
  successful: number;
  failed: number;
  results: BulkIssuanceRecord[];
  startedAt: string;
  completedAt: string;
}

export interface IssuerStats {
  totalIssued: number;
  activeCredentials: number;
  revokedCredentials: number;
  popularSchemas: { schema: string; count: number }[];
  issuanceOverTime: { date: string; count: number }[];
  averageVerificationTime: number;
}

export interface IssuerProfile {
  did: string;
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  publicKey: string;
  isVerified: boolean;
  supportedSchemas: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SchemaTemplate {
  id: string;
  name: string;
  category: 'education' | 'professional' | 'project' | 'identity' | 'custom';
  fields: SchemaField[];
  description: string;
  isPublic: boolean;
}

export interface IssuancePolicy {
  maxCredentialsPerDay?: number;
  allowedSchemas: string[];
  requireManualApproval?: boolean;
  automaticExpiration?: number;
  dataRetentionDays?: number;
}

// Pre-defined schema templates for common use cases
export const PREDEFINED_SCHEMAS: Record<string, CredentialSchema> = {
  'web3-bootcamp': {
    id: 'web3-bootcamp',
    name: 'Web3 Bootcamp Completion',
    fields: [
      { name: 'courseName', type: 'string', required: true },
      { name: 'completionDate', type: 'date', required: true },
      { name: 'skillLevel', type: 'string', required: true },
      { name: 'instructor', type: 'string', required: false }
    ],
    description: 'Certification for completing a Web3 development bootcamp',
    version: '1.0',
    createdAt: new Date().toISOString(),
    isActive: true
  },
  'project-verification': {
    id: 'project-verification',
    name: 'Project Verification',
    fields: [
      { name: 'projectName', type: 'string', required: true },
      { name: 'role', type: 'string', required: true },
      { name: 'contributionDate', type: 'date', required: true },
      { name: 'technologies', type: 'array', required: false }
    ],
    description: 'Verification of project contribution and role',
    version: '1.0',
    createdAt: new Date().toISOString(),
    isActive: true
  },
  'professional-cert': {
    id: 'professional-cert',
    name: 'Professional Certification',
    fields: [
      { name: 'certificationName', type: 'string', required: true },
      { name: 'issuingOrganization', type: 'string', required: true },
      { name: 'issueDate', type: 'date', required: true },
      { name: 'expirationDate', type: 'date', required: false }
    ],
    description: 'Professional certification or license',
    version: '1.0',
    createdAt: new Date().toISOString(),
    isActive: true
  }
};