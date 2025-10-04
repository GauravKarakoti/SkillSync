export interface CredentialIssuanceRequest {
  schema: string;
  recipient: string;
  data: Record<string, any>;
  issuerDid: string;
  expiration?: number;
}

export interface CredentialVerificationRequest {
  proof: any;
  credentialId: string;
}

export interface CredentialRecord {
  id: string;
  schema: string;
  issuerDid: string;
  recipientDid: string;
  data: Record<string, any>;
  issuedAt: string;
  status: 'active' | 'revoked';
  transactionHash?: string;
}

export interface VerificationResult {
  isValid: boolean;
  verifiedAt: string;
  credentialId?: string;
  credential?: CredentialRecord;
}