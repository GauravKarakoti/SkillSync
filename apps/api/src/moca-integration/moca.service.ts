import { ethers } from 'ethers';
import { Credential } from '../shared-types/src/credential';
import * as CredentialRegistry from '../abi/CredentialRegistry.json';
import dotenv from 'dotenv';
dotenv.config();

// NOTE: You will need to copy the ABI from the compiled contract artifact
const CREDENTIAL_REGISTRY_ABI = CredentialRegistry.abi;

export class MocaService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.MOCA_RPC_URL);
    this.wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY as string, this.provider);
    this.contract = new ethers.Contract(
      process.env.CREDENTIAL_REGISTRY_ADDRESS as string,
      CREDENTIAL_REGISTRY_ABI,
      this.wallet
    );
  }

  async issueCredential(recipientDid: string, credential: Credential): Promise<string> {
    try {
      const tx = await this.contract.issueCredential(
        recipientDid,
        credential.issuer,
        credential.issuanceDate,
        credential.credentialSubject.id,
        credential.credentialSubject.skill,
      );
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error issuing credential:', error);
      throw new Error('Failed to issue credential on the blockchain.');
    }
  }
}