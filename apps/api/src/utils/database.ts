import { CredentialRecord } from '../types/credential-types';

// Simple in-memory store for development - replace with real database in production
const credentialStore = new Map<string, CredentialRecord>();

export const databaseUtils = {
  async storeCredential(credential: CredentialRecord): Promise<void> {
    credentialStore.set(credential.id, credential);
    console.log(`Stored credential: ${credential.id}`);
  },

  async getCredential(credentialId: string): Promise<CredentialRecord | null> {
    return credentialStore.get(credentialId) || null;
  },

  async getUserCredentials(userDid: string): Promise<CredentialRecord[]> {
    return Array.from(credentialStore.values())
      .filter(cred => cred.recipientDid === userDid && cred.status === 'active');
  },

  async revokeCredential(credentialId: string): Promise<boolean> {
    const credential = credentialStore.get(credentialId);
    if (credential) {
      credential.status = 'revoked';
      credentialStore.set(credentialId, credential);
      return true;
    }
    return false;
  }
};