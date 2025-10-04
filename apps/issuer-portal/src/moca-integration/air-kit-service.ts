import { UserSession, CredentialData, ZKProofRequirements, VerificationResult } from './types';
import { AirService, BUILD_ENV_TYPE } from '@mocanetwork/airkit';

export class MocaIntegrationService {
  private isInitialized = false;
  private airService!: AirService;
  
  // Constructor is made private to enforce initialization via the static create method.
  private constructor() {}

  /**
   * Statically creates and asynchronously initializes an instance of the service.
   * This factory pattern prevents race conditions by ensuring the service is ready before it's used.
   */
  public static async create(): Promise<MocaIntegrationService> {
    const service = new MocaIntegrationService();
    await service.initialize();
    return service;
  }

  /**
   * Asynchronously initializes the Moca AIR Kit service. Called by the static create method.
   */
  private async initialize() {
    // Prevent re-initialization
    if (this.isInitialized) return;

    try {
      this.airService = new AirService({
        partnerId: process.env.NEXT_PUBLIC_MOCA_PARTNER_ID!,
      });

      await this.airService.init({
        buildEnv: (process.env.NEXT_PUBLIC_MOCA_BUILD_ENV as BUILD_ENV_TYPE) || 'staging',
        enableLogging: true,
        skipRehydration: false,
      });
      
      this.isInitialized = true;
      console.log('✅ MocaIntegrationService initialized successfully.');
    } catch (error) {
      console.error('🔥 Failed to initialize MocaIntegrationService:', error);
      this.isInitialized = false;
      // Re-throw to let the caller handle the failure
      throw new Error('MocaIntegrationService initialization failed.');
    }
  }

  async initializeUserSession(): Promise<UserSession> {
    if (!this.isInitialized) {
      throw new Error('Service not initialized. Please use the static create() method.');
    }

    try {
      // This will open a login modal for the user
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
      throw new Error('Service not initialized');
    }

    try {
        const { token } = await this.airService.getAccessToken();
        const userInfo = await this.airService.getUserInfo();
        const issuerDid = userInfo.airId?.id as string;

        if (!issuerDid) {
          throw new Error("Could not determine issuer DID. User may not be authenticated.");
        }

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
      throw new Error('Service not initialized');
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
