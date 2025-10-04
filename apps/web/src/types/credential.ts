export interface Credential {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  status: 'active' | 'revoked';
  schema: string;
  claims?: Record<string, any>;
}

export interface UserSession {
  userDid: string;
  smartWallet: string;
  sessionToken: string;
  isAuthenticated: boolean;
}

export interface VerificationRequest {
  credentialId: string;
  proofRequirements: {
    credentialExists: boolean;
    isActive: boolean;
    issuerTrusted?: boolean;
  };
}

export interface QRCodeData {
  type: 'credential-verification';
  proof: any;
  timestamp: number;
}