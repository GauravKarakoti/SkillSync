export interface CredentialSubject {
  id: string;
  skill: string;
}

export interface Credential {
  issuer: string;
  issuanceDate: number; // Using number for timestamp
  credentialSubject: CredentialSubject;
}

export interface CredentialBase {
  id: string;
  schema: string;
  issuerDid: string;
  recipientDid: string;
  issuedAt: string;
  status: 'active' | 'revoked';
}

export interface CredentialWithData extends CredentialBase {
  data: Record<string, unknown>;
  transactionHash?: string;
}