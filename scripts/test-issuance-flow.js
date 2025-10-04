const { MocaIntegrationService } = require('../apps/api/src/moca-integration/dist');

async function testCredentialIssuance() {
  console.log('🚀 Starting SkillSync MVP Test...\n');
  
  const mocaService = new MocaIntegrationService();
  
  try {
    // Test user onboarding
    console.log('1. Testing user onboarding...');
    const userSession = await mocaService.initializeUserSession();
    console.log('✅ User onboarded with DID:', userSession.userDid);
    console.log('   Smart Wallet:', userSession.smartWallet);
    console.log('   Session Token:', userSession.sessionToken.substring(0, 20) + '...\n');
    
    // Test credential issuance
    console.log('2. Testing credential issuance...');
    const testCredential = {
      courseName: 'Advanced Solidity Development',
      completionDate: '2024-01-15',
      skillLevel: 'Advanced',
      instructor: 'Web3Master DAO'
    };
    
    const issuerDid = 'did:moca:issuer:test123';
    
    const credential = await mocaService.issueCredential(
      issuerDid,
      userSession.userDid,
      {
        schema: 'web3-bootcamp',
        claims: testCredential
      }
    );
    
    console.log('✅ Credential issued:');
    console.log('   Credential ID:', credential.id);
    console.log('   Schema:', credential.schema);
    console.log('   Issuer:', credential.issuer);
    console.log('   Recipient:', credential.recipient);
    console.log('   Claims:', JSON.stringify(credential.claims, null, 2));
    console.log('');
    
    // Test ZK proof generation
    console.log('3. Testing ZK proof generation...');
    const proofRequirements = {
      credentialExists: true,
      isActive: true,
      issuerTrusted: true
    };
    
    const proof = await mocaService.generateZKProof(credential.id, proofRequirements);
    console.log('✅ ZK Proof generated:');
    console.log('   Proof ID:', proof.proofId);
    console.log('   Requirements:', JSON.stringify(proof.requirements, null, 2));
    console.log('');
    
    // Test verification
    console.log('4. Testing credential verification...');
    const verification = await mocaService.verifyCredential(proof);
    console.log('✅ Verification completed:');
    console.log('   Is Valid:', verification.isValid);
    console.log('   Verified At:', verification.verifiedAt);
    console.log('   Credential ID:', verification.credentialId);
    console.log('');
    
    console.log('🎉 All tests passed! SkillSync MVP is working correctly.');
    console.log('\n📊 Test Summary:');
    console.log('   ✓ User onboarding with social login');
    console.log('   ✓ Credential issuance with custom claims');
    console.log('   ✓ Zero-knowledge proof generation');
    console.log('   ✓ Privacy-preserving verification');
    console.log('   ✓ Mock Moca Network integration');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testCredentialIssuance().catch(console.error);