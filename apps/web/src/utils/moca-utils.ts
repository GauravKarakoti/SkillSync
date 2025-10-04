import { UserSession, VerificationRequest, QRCodeData } from '../types/credential';

export class MocaWebUtils {
  static async initializeUserSession(): Promise<UserSession> {
    try {
      // Check if we have a stored session
      const storedSession = localStorage.getItem('moca-user-session');
      if (storedSession) {
        return JSON.parse(storedSession);
      }

      // Initialize new session with the API
      const response = await fetch('/api/auth/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to initialize user session');
      }

      const userSession = await response.json();
      
      // Store session
      localStorage.setItem('moca-user-session', JSON.stringify(userSession));
      
      return userSession;
    } catch (error) {
      console.error('Error initializing user session:', error);
      throw error;
    }
  }

  static async generateVerificationQR(credentialId: string): Promise<string> {
    try {
      const verificationRequest: VerificationRequest = {
        credentialId,
        proofRequirements: {
          credentialExists: true,
          isActive: true,
          issuerTrusted: true
        }
      };

      const response = await fetch('/api/credentials/generate-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verificationRequest)
      });

      if (!response.ok) {
        throw new Error('Failed to generate verification proof');
      }

      const proof = await response.json();
      
      const qrData: QRCodeData = {
        type: 'credential-verification',
        proof,
        timestamp: Date.now()
      };

      return JSON.stringify(qrData);
    } catch (error) {
      console.error('Error generating verification QR:', error);
      throw error;
    }
  }

  static async loadUserCredentials(userDid: string): Promise<any[]> {
    try {
      const response = await fetch(`/api/users/${userDid}/credentials`);
      if (!response.ok) {
        throw new Error('Failed to load credentials');
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading user credentials:', error);
      return [];
    }
  }

  static clearUserSession(): void {
    localStorage.removeItem('moca-user-session');
  }

  static isSessionValid(session: UserSession): boolean {
    // ✅ FIX: Use the double negation operator (!!) to ensure a boolean is returned.
    return !!(session.isAuthenticated && session.userDid && session.sessionToken);
  }
}