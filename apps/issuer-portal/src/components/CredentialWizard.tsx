'use client';

import React, { useState, useEffect } from 'react';
// FIX: Corrected import path
import { MocaIntegrationService } from '../moca-integration/air-kit-service';

const CREDENTIAL_SCHEMAS = {
  'web3-bootcamp': {
    name: 'Web3 Bootcamp Completion',
    fields: ['courseName', 'completionDate', 'skillLevel', 'instructor']
  },
  'project-verification': {
    name: 'Project Verification',
    fields: ['projectName', 'role', 'contributionDate', 'technologies']
  },
  'professional-cert': {
    name: 'Professional Certification',
    fields: ['certificationName', 'issuingOrganization', 'issueDate', 'expirationDate']
  }
};

export const CredentialWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSchema, setSelectedSchema] = useState<string>('');
  const [recipientDid, setRecipientDid] = useState('');
  const [credentialData, setCredentialData] = useState<Record<string, string>>({});
  const [isIssuing, setIsIssuing] = useState(false);
  const [issuedCredential, setIssuedCredential] = useState<{ id: string } | null>(null);
  
  // FIX: State to hold the initialized and authenticated Moca service instance
  const [mocaService, setMocaService] = useState<MocaIntegrationService | null>(null);
  const [issuerDid, setIssuerDid] = useState<string>('');
  const [isServiceReady, setIsServiceReady] = useState(false);

  // FIX: Initialize the service and authenticate the issuer on component mount
  useEffect(() => {
    const initializeIssuerSession = async () => {
      try {
        const service = await MocaIntegrationService.create();
        alert("Please log in as the issuer to continue.");
        const session = await service.initializeUserSession();
        setMocaService(service);
        setIssuerDid(session.userDid);
        setIsServiceReady(true);
      } catch (error) {
        console.error("Failed to initialize issuer session:", error);
        alert("Could not initialize the Moca service. Please refresh and try again.");
      }
    };
    initializeIssuerSession();
  }, []);
  
  const handleSchemaSelect = (schemaId: string) => {
    setSelectedSchema(schemaId);
    setCurrentStep(2);
  };
  
  const handleIssueCredential = async () => {
    if (!mocaService) {
      alert("Service not ready. Please wait or refresh.");
      return;
    }
    if (!recipientDid) {
      alert('Please enter the recipient\'s DID.');
      return;
    }
    
    setIsIssuing(true);
    try {
      // FIX: Generate a unique ID for the new credential.
      const newCredentialId = `cred_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // FIX: Correctly call the service method with the right parameters.
      // The issuer's DID is handled internally by the service from the authenticated session.
      await mocaService.issueCredential(
        recipientDid,
        newCredentialId,
        {
          schema: selectedSchema,
          claims: credentialData
        }
      );
      
      setIssuedCredential({ id: newCredentialId });
      setCurrentStep(3);
    } catch (error) {
      console.error('Failed to issue credential:', error);
      alert('Failed to issue credential. Please check the console and try again.');
    } finally {
      setIsIssuing(false);
    }
  };
  
  const resetWizard = () => {
    setCurrentStep(1);
    setSelectedSchema('');
    setRecipientDid('');
    setCredentialData({});
    setIssuedCredential(null);
  };

  if (!isServiceReady) {
    return (
        <div className="flex flex-col justify-center items-center h-64 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Initializing Moca Service...</p>
          <p className="text-sm text-gray-500">Please check the login pop-up.</p>
        </div>
      );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border p-6">
        <div className="text-right text-xs text-gray-500 mb-4">
            Issuing as: <span className="font-mono bg-gray-100 p-1 rounded">{issuerDid ? `${issuerDid.substring(0, 20)}...` : '...'}</span>
        </div>
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {[1, 2, 3].map(step => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step}
              </div>
              <div className={`text-sm mt-1 ${
                currentStep >= step ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step === 1 && 'Select Schema'}
                {step === 2 && 'Fill Details'}
                {step === 3 && 'Complete'}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {currentStep === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Select Credential Type</h2>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(CREDENTIAL_SCHEMAS).map(([id, schema]) => (
              <div 
                key={id}
                className="border border-gray-200 p-4 rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
                onClick={() => handleSchemaSelect(id)}
              >
                <h3 className="font-semibold text-lg text-gray-800">{schema.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Fields: {schema.fields.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {currentStep === 2 && selectedSchema && (
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Issue {CREDENTIAL_SCHEMAS[selectedSchema as keyof typeof CREDENTIAL_SCHEMAS].name}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient DID
              </label>
              <input
                type="text"
                value={recipientDid}
                onChange={(e) => setRecipientDid(e.target.value)}
                className="w-full border text-gray-700 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="did:moca:1a2b3c4d5e..."
              />
            </div>
            
            {CREDENTIAL_SCHEMAS[selectedSchema as keyof typeof CREDENTIAL_SCHEMAS].fields.map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  onChange={(e) => setCredentialData(prev => ({
                    ...prev,
                    [field]: e.target.value
                  }))}
                  className="w-full border text-gray-700 border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}
            
            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleIssueCredential}
                disabled={isIssuing}
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-3 rounded-lg transition-colors"
              >
                {isIssuing ? 'Issuing...' : 'Issue Credential'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {currentStep === 3 && issuedCredential && (
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Credential Issued Successfully!</h2>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2">Credential Details:</h3>
            <p className="break-words"><strong>ID:</strong> {issuedCredential.id}</p>
            <p className="break-words"><strong>Recipient:</strong> {recipientDid}</p>
            <p><strong>Schema:</strong> {selectedSchema}</p>
            <p><strong>Issued At:</strong> {new Date().toLocaleString()}</p>
          </div>
          <button
            onClick={resetWizard}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Issue Another Credential
          </button>
        </div>
      )}
    </div>
  );
};
