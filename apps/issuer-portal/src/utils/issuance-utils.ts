import { CredentialSchema, IssuanceFormData, BulkIssuanceRecord } from '../types/issuance';

export const CREDENTIAL_SCHEMAS: Record<string, CredentialSchema> = {
  'web3-bootcamp': {
    id: 'web3-bootcamp',
    name: 'Web3 Bootcamp Completion',
    fields: ['courseName', 'completionDate', 'skillLevel', 'instructor'],
    description: 'Certification for completing a Web3 development bootcamp'
  },
  'project-verification': {
    id: 'project-verification',
    name: 'Project Verification',
    fields: ['projectName', 'role', 'contributionDate', 'technologies'],
    description: 'Verification of project contribution and role'
  },
  'professional-cert': {
    id: 'professional-cert',
    name: 'Professional Certification',
    fields: ['certificationName', 'issuingOrganization', 'issueDate', 'expirationDate'],
    description: 'Professional certification or license'
  }
};

export class IssuanceUtils {
  static validateRecipientDid(did: string): boolean {
    return did.startsWith('did:moca:') && did.length > 20;
  }

  static async issueCredential(issuanceData: IssuanceFormData, issuerDid: string): Promise<any> {
    try {
      const response = await fetch('/api/credentials/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...issuanceData,
          issuerDid
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to issue credential');
      }

      return await response.json();
    } catch (error) {
      console.error('Error issuing credential:', error);
      throw error;
    }
  }

  static async processBulkIssuance(records: BulkIssuanceRecord[], schema: string, issuerDid: string): Promise<BulkIssuanceRecord[]> {
    const results: BulkIssuanceRecord[] = [];

    for (const record of records) {
      try {
        await this.issueCredential({
          recipientDid: record.recipientDid,
          credentialData: record.data,
          schema
        }, issuerDid);

        results.push({ ...record, status: 'issued' });
      } catch (error) {
        results.push({
          ...record,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  static parseBulkIssuanceCSV(csvText: string): BulkIssuanceRecord[] {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    if (!headers.includes('recipientDid')) {
      throw new Error('CSV must contain a recipientDid column');
    }

    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const record: BulkIssuanceRecord = {
        recipientDid: '',
        data: {},
        status: 'pending'
      };

      headers.forEach((header, i) => {
        if (header === 'recipientDid') {
          record.recipientDid = values[i];
        } else {
          record.data[header] = values[i];
        }
      });

      if (!this.validateRecipientDid(record.recipientDid)) {
        throw new Error(`Invalid DID format in row ${index + 2}`);
      }

      return record;
    });
  }
}