import express from 'express';
import { MocaIntegrationService } from '../moca-integration/air-kit-service';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const mocaService = new MocaIntegrationService();

// Store credentials in memory (replace with database in production)
const credentialStore = new Map();

router.post('/issue', async (req, res) => {
  try {
    const { schema, recipient, data, issuerDid } = req.body;
    
    if (!schema || !recipient || !data || !issuerDid) {
      return res.status(400).json({ 
        error: 'Missing required fields: schema, recipient, data, issuerDid' 
      });
    }
    
    console.log('Issuing credential:', { schema, recipient, issuerDid });

    // ✅ FIX: 1. Generate a unique credential ID *before* the service call.
    const newCredentialId = uuidv4();
    
    // ✅ FIX: 2. Call the service. It doesn't return anything.
    // Notice the arguments now match the service's signature: (recipient, credentialId, data)
    await mocaService.issueCredential(recipient, newCredentialId, {
      schema,
      claims: data
    });
    
    // ✅ FIX: 3. Store reference in our database using the ID we just generated.
    const credentialRecord = {
      id: newCredentialId, // Use the generated ID
      schema,
      issuerDid,
      recipientDid: recipient,
      data,
      issuedAt: new Date().toISOString(),
      status: 'active'
    };
    
    credentialStore.set(newCredentialId, credentialRecord);
    
    // 4. In a real implementation, we would also record on-chain here
    
    console.log('Credential issued successfully:', newCredentialId);
    
    res.json({
      success: true,
      credentialId: newCredentialId, // Return the ID we generated
      credential: credentialRecord
    });
    
  } catch (error) {
    console.error('Credential issuance error:', error);
    res.status(500).json({ 
      error: 'Failed to issue credential',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Verify a credential
router.post('/verify', async (req, res) => {
  try {
    const { proof, credentialId } = req.body;
    
    if (!proof || !credentialId) {
      return res.status(400).json({ 
        error: 'Missing required fields: proof, credentialId' 
      });
    }
    
    console.log('Verifying credential:', credentialId);
    
    // 1. Verify ZK proof with Moca
    const verification = await mocaService.verifyCredential(proof);
    
    // 2. Check if we have the credential in our store
    const credentialRecord = credentialStore.get(credentialId);
    
    const result = {
      isValid: verification.isValid && !!credentialRecord,
      verifiedAt: new Date().toISOString(),
      credentialId,
      credential: credentialRecord
    };
    
    console.log('Verification result:', result.isValid);
    
    res.json(result);
    
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      error: 'Verification failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user credentials
router.get('/users/:did/credentials', async (req, res) => {
  try {
    const { did } = req.params;
    
    if (!did) {
      return res.status(400).json({ error: 'Missing user DID' });
    }
    
    // Find all credentials for this user
    const userCredentials = Array.from(credentialStore.values())
      .filter(cred => cred.recipientDid === did)
      .map(cred => ({
        id: cred.id,
        name: cred.data.courseName || cred.data.certificationName || cred.data.projectName || 'Unnamed Credential',
        issuer: cred.issuerDid,
        issueDate: cred.issuedAt,
        status: cred.status,
        schema: cred.schema
      }));
    
    console.log(`Found ${userCredentials.length} credentials for user: ${did}`);
    
    res.json(userCredentials);
    
  } catch (error) {
    console.error('Failed to fetch user credentials:', error);
    res.status(500).json({ 
      error: 'Failed to fetch credentials',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get credential by ID
router.get('/:credentialId', async (req, res) => {
  try {
    const { credentialId } = req.params;
    
    const credential = credentialStore.get(credentialId);
    
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }
    
    res.json(credential);
    
  } catch (error) {
    console.error('Failed to fetch credential:', error);
    res.status(500).json({ error: 'Failed to fetch credential' });
  }
});

export default router;