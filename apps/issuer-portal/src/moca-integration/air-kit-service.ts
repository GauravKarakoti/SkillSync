import { UserSession } from './types';
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
    // The initialize method is now private and called internally by create.
    await service.initialize();
    return service;
  }

  /**
   * Asynchronously initializes the Moca AIR Kit service. Called by the static create method.
   */
  private async initialize() {
    // Prevent re-initialization
    if (this.isInitialized || typeof window === 'undefined') return;

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

  /**
   * Retrieves the DID of the currently logged-in user.
   */
  async getDid(): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('Service not initialized.');
    }
    const userInfo = await this.airService.getUserInfo();
    const did = userInfo.airId?.id;
    if (!did) {
        // Prompt user to log in if they don't have a DID yet.
        await this.airService.login();
        const newUserInfo = await this.airService.getUserInfo();
        const newDid = newUserInfo.airId?.id;
        if (!newDid) throw new Error("Could not retrieve user DID after login.");
        return newDid;
    }
    return did;
  }

  async initializeUserSession(): Promise<UserSession> {
    if (!this.isInitialized) {
      throw new Error('Service not initialized. Please use the static create() method.');
    }

    try {
      // This will open a login modal for the user if not already logged in
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
}
