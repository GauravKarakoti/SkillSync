'use client';

import React, { useState, useEffect } from 'react';
import { MocaIntegrationService } from '../moca-integration/air-kit-service';

interface Credential {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  status: 'active' | 'revoked';
  schema: string;
}

export const CredentialWallet: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [mocaService, setMocaService] = useState<MocaIntegrationService | null>(null);
  const [userDid, setUserDid] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeMoca();
  }, []);

  const initializeMoca = async () => {
    try {
      setIsLoading(true);
      console.log('Initializing Moca Integration Service...');
      const service = await MocaIntegrationService.create();
      console.log('Moca Service initialized:', service);
      const userSession = await service.initializeUserSession();
      console.log('User session initialized:', userSession);
      setMocaService(service);
      setUserDid(userSession.userDid || '');
      await loadUserCredentials(userSession.userDid || '');
      console.log('User credentials loaded');
    } catch (error) {
      console.error('Failed to initialize Moca service:', error);
      // Optionally, set an error state here to display a message in the UI
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserCredentials = async (did: string) => {
    try {
      // Mock credentials - Replace with API call
      const mockCredentials: Credential[] = [
        {
          id: 'cred_1',
          name: 'Advanced Solidity Developer',
          issuer: 'Web3Bootcamp',
          issueDate: '2024-01-15',
          status: 'active',
          schema: 'web3-bootcamp-verification'
        },
        {
          id: 'cred_2',
          name: 'React Expert Certification',
          issuer: 'CodeCampDAO',
          issueDate: '2024-01-10',
          status: 'active',
          schema: 'professional-cert-verification'
        }
      ];
      setCredentials(mockCredentials);
    } catch (error) {
      console.error('Failed to load credentials:', error);
    }
  };

  const handleVerifyCredential = async (programId: string) => {
    if (!mocaService) return;
    
    try {
      alert(`Attempting to verify with program: ${programId}`);
      const result = await mocaService.verifyCredential(programId);
      
      if (result.isValid) {
        alert(`✅ Verification Successful!\nCredential ID: ${result.credentialId}\nVerified At: ${result.verifiedAt}`);
      } else {
        alert('❌ Verification Failed. Please try again.');
      }
    } catch (error) {
      console.error('Failed to verify credential:', error);
      alert('An error occurred during verification.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Your Credential Wallet</h2>
          <div className="text-sm text-gray-600">
            DID: {userDid ? `${userDid.substring(0, 20)}...` : 'Loading...'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map(cred => (
            <div key={cred.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-gray-800">{cred.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${
                  cred.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {cred.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">Issuer: {cred.issuer}</p>
              <p className="text-gray-600 text-sm mb-4">
                Issued: {new Date(cred.issueDate).toLocaleDateString()}
              </p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleVerifyCredential(cred.schema)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm transition-colors"
                >
                  Verify
                </button>
                <button className="flex-1 border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded text-sm transition-colors">
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {credentials.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No credentials yet</h3>
            <p className="text-gray-500">Your verified credentials will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};
