/**
 * Core types for Moca Network integration
 * Defines structures for user sessions, credentials, and zero-knowledge proofs
 */

export interface UserSession {
  userDid: string;
  smartWallet: string;
  sessionToken: string;
  isAuthenticated: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface CredentialData {
  schema: string;
  claims: Record<string, unknown>;
  expiration?: number;
  metadata?: CredentialMetadata;
}

export interface CredentialMetadata {
  version: string;
  issuerName: string;
  issuanceDate: string;
  tags?: string[];
}

export interface ZKProofRequirements {
  credentialExists: boolean;
  isActive: boolean;
  issuerTrusted?: boolean;
  minAge?: number;
  maxAge?: number;
  customRequirements?: Record<string, unknown>;
}

export interface ZKProofResult {
  proofId: string;
  credentialId: string;
  requirements: ZKProofRequirements;
  proofData: string;
  generatedAt: string;
  expiresAt?: string;
}

export interface VerificationResult {
  isValid: boolean;
  verifiedAt: string;
  credentialId?: string;
  error?: string;
  proofUsed?: ZKProofResult;
}

export interface MocaNetworkConfig {
  chainId: string;
  rpcUrl: string;
  appId: string;
  airKitVersion: string;
}

export interface AIRKitIntegration {
  accountService: {
    socialLogin: (provider: 'google' | 'github' | 'apple', options?: Record<string, unknown>) => Promise<UserSession>;
    createSmartWallet: (userDid: string) => Promise<string>;
    validateSession: (sessionToken: string) => Promise<boolean>;
  };
  credentialService: {
    issue: (request: CredentialIssueRequest) => Promise<CredentialIssueResponse>;
    verify: (proof: ZKProofResult) => Promise<VerificationResult>;
    generateProof: (request: ProofGenerationRequest) => Promise<ZKProofResult>;
  };
}

export interface CredentialIssueRequest {
  issuer: string;
  recipient: string;
  schema: string;
  claims: Record<string, unknown>;
  expiration?: number;
}

export interface CredentialIssueResponse {
  id: string;
  issuer: string;
  recipient: string;
  schema: string;
  issuedAt: string;
  transactionHash?: string;
  status: 'issued' | 'pending' | 'failed';
}

export interface ProofGenerationRequest {
  credentialId: string;
  requirements: ZKProofRequirements;
  revealFields?: string[];
}