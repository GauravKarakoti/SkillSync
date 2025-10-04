export interface CredentialSchema {
  id: string;
  name: string;
  fields: string[];
  description: string;
}

export interface IssuanceFormData {
  recipientDid: string;
  credentialData: Record<string, string>;
  schema: string;
  expiration?: number;
}

export interface BulkIssuanceRecord {
  recipientDid: string;
  data: Record<string, string>;
  status: 'pending' | 'issued' | 'failed';
  error?: string;
}

export interface IssuerStats {
  totalIssued: number;
  activeCredentials: number;
  revokedCredentials: number;
  popularSchemas: { schema: string; count: number }[];
}