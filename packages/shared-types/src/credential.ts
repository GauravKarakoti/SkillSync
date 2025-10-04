export interface CredentialBase {
  id: string;
  schema: string;
  issuerDid: string;
  recipientDid: string;
  issuedAt: string;
  status: 'active' | 'revoked';
}

export interface CredentialWithData extends CredentialBase {
  data: Record<string, any>;
  transactionHash?: string;
}