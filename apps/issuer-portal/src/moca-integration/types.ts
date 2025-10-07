export interface UserSession {
  userDid: string;
  smartWallet: string;
  sessionToken: string;
}

export interface CredentialData {
  schema: string;
  claims: Record<string, unknown>;
  expiration?: number;
}

export interface ZKProofRequirements {
  credentialExists: boolean;
  isActive: boolean;
  issuerTrusted?: boolean;
  customRequirements?: Record<string, unknown>;
}

export interface VerificationResult {
  isValid: boolean;
  verifiedAt: string;
  credentialId?: string;
}