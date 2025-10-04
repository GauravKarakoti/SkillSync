import { UserSession, CredentialData, VerificationResult } from './types';
import dotenv from 'dotenv';
dotenv.config();

// CORRECTED: Use a named import to get the AirService class.
import { AirService } from '@mocanetwork/airkit';
// We also need this type for the init method
import { BUILD_ENV_TYPE } from '@mocanetwork/airkit';

export class MocaIntegrationService {
  private isInitialized = false;
  // This will now correctly reference the AirService class type
  private airService!: AirService;
  
  constructor() {
    this.initialize();
  }

  /**
   * Asynchronously initializes the Moca AIR Kit service.
   */
  private async initialize() {
    // FIX: The Moca Airkit is a client-side SDK and cannot run on the server.
    // This check prevents the server from crashing during initialization.
    if (typeof window === 'undefined') {
      console.warn('⚠️ MocaIntegrationService cannot be initialized on the server because the Airkit SDK is for client-side use only.');
      this.isInitialized = false;
      return;
    }

    try {
      this.airService = new AirService({
        partnerId: process.env.NEXT_PUBLIC_MOCA_PARTNER_ID!,
      });
      console.log('AirService instance created with partnerId:', process.env.NEXT_PUBLIC_MOCA_PARTNER_ID);

      // CHANGED: Call the init method to configure the service
      await this.airService.init({
        buildEnv: (process.env.NEXT_PUBLIC_MOCA_BUILD_ENV as BUILD_ENV_TYPE) || 'staging',
        enableLogging: true,
        skipRehydration: false,
      });
      console.log('AirService initialized with buildEnv:', process.env.NEXT_PUBLIC_MOCA_BUILD_ENV || 'staging');
      this.isInitialized = true;
      console.log('✅ MocaIntegrationService initialized successfully.');
    } catch (error) {
      console.error('🔥 Failed to initialize MocaIntegrationService:', error);
      this.isInitialized = false;
    }
  }

  async initializeUserSession(): Promise<UserSession> {
    if (!this.isInitialized) {
      throw new Error('Service not initialized. The Moca SDK cannot be run on the server.');
    }

    try {
      await this.airService.login();
      const userInfo = await this.airService.getUserInfo();
      const { token } = await this.airService.getAccessToken();
      
      const session: UserSession = {
        userDid: userInfo.airId?.id as string,
        smartWallet: userInfo.user.abstractAccountAddress as string,
        sessionToken: token
      };
      
      console.log('✅ User session initialized for DID:', session.userDid);
      return session;
    } catch (error) {
      console.error('🔥 Failed to initialize user session:', error);
      throw error;
    }
  }

  async issueCredential(recipientDid: string, credentialId: string, credentialData: CredentialData): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Service not initialized. The Moca SDK cannot be run on the server.');
    }

    try {
        const { token } = await this.airService.getAccessToken();
        const userInfo = await this.airService.getUserInfo();
        const issuerDid = userInfo.airId?.id as string;

        await this.airService.issueCredential({
            authToken: token,
            issuerDid: issuerDid,
            credentialId: credentialId,
            credentialSubject: credentialData.claims,
        });
      
      console.log('✅ Credential issued successfully:', credentialId);
    } catch (error) {
      console.error('🔥 Failed to issue credential:', error);
      throw error;
    }
  }

  async verifyCredential(programId: string): Promise<VerificationResult> {
    if (!this.isInitialized) {
      throw new Error('Service not initialized. The Moca SDK cannot be run on the server.');
    }

    try {
      const { token } = await this.airService.getAccessToken();

      const verification = await this.airService.verifyCredential({
        authToken: token,
        programId: programId,
      });
      
      const result: VerificationResult = {
        isValid: verification.success, 
        verifiedAt: new Date().toISOString(),
        credentialId: verification.payload?.credentialId || 'N/A' 
      };
      
      console.log(`✅ Credential verification result for program ${programId}: ${result.isValid}`);
      return result;
    } catch (error) {
      console.error('🔥 Failed to verify credential:', error);
      throw error;
    }
  }
}
