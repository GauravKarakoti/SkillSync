"use client";

import { useState, useEffect } from 'react';
import { MocaIntegrationService } from '../moca-integration/air-kit-service';
import { Credential } from '../shared-types/src/credential';

export function CredentialWizard() {
  const [mocaService, setMocaService] = useState<MocaIntegrationService | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [recipientDid, setRecipientDid] = useState('');
  const [skill, setSkill] = useState('');
  const [issuerDid, setIssuerDid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For loading state

  useEffect(() => {
    const initializeMoca = async () => {
      // Ensure this code runs only in the browser
      if (typeof window !== 'undefined') {
        try {
          // Use the static create method instead of 'new'
          const service = await MocaIntegrationService.create();
          setMocaService(service);
          
          // Fetch the DID after service is initialized
          const did = await service.getDid();
          setIssuerDid(did);

        } catch (error) {
          console.error("Failed to initialize Moca Service or get DID:", error);
          alert("Could not connect to Moca ID. Please refresh and try again.");
        }
      }
    };
    initializeMoca();
  }, []);

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleIssueCredential = async () => {
    if (!mocaService || !issuerDid) {
      alert('Moca service is not ready or issuer DID is missing. Please wait or refresh the page.');
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const credential: Credential = {
        issuer: issuerDid,
        issuanceDate: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
        credentialSubject: {
          id: recipientDid,
          skill: skill,
        },
      };

      const issueData = {
        recipientDid: recipientDid,
        credential,
      };

      const response = await fetch('/api/credentials/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issueData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
      }

      const result = await response.json();
      console.log('Credential issued, transaction hash:', result.txHash);
      alert(`Credential issued successfully!\nTransaction Hash: ${result.txHash}`);
      
      setCurrentStep(1);
      setRecipientDid('');
      setSkill('');

    } catch (error) {
      console.error('Error issuing credential:', error);
      alert(`Failed to issue credential: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <label htmlFor="recipientDid" className="block text-sm font-medium text-gray-700">
              Recipient DID
            </label>
            <input
              type="text"
              id="recipientDid"
              value={recipientDid}
              onChange={(e) => setRecipientDid(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              placeholder="did:moca:..."
            />
          </div>
        );
      case 2:
        return (
          <div>
            <label htmlFor="skill" className="block text-sm font-medium text-gray-700">
              Skill
            </label>
            <input
              type="text"
              id="skill"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              placeholder="e.g., Solidity"
            />
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Confirm Details</h3>
            <div className="mt-4 text-gray-900 space-y-2">
              <p><span className="font-semibold">Recipient DID:</span> {recipientDid}</p>
              <p><span className="font-semibold">Skill:</span> {skill}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Issue a New Credential</h2>
      
      {issuerDid ? (
        <p className="text-center text-sm text-gray-500 mb-4 break-all">Issuing as: {issuerDid}</p>
      ) : (
        <p className="text-center text-sm text-red-500 mb-4">Connecting to Moca ID...</p>
      )}

      <div className="p-4 border rounded-md min-h-[120px]">
        {renderStep()}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50"
          disabled={currentStep === 1 || isLoading}
        >
          Back
        </button>
        {currentStep < 3 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            disabled={ (currentStep === 1 && !recipientDid) || (currentStep === 2 && !skill) || isLoading }
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleIssueCredential}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            disabled={!issuerDid || isLoading}
          >
            {isLoading ? 'Issuing...' : 'Issue Credential'}
          </button>
        )}
      </div>
    </div>
  );
}
