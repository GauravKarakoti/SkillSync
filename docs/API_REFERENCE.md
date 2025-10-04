# SkillSync API Reference

## Base URL

[http://localhost:4000/api](http://localhost:4000/api)

## Authentication
Endpoints require a valid Moca Network session token in the header:

```text
Authorization: Bearer <session-token>
```


## Endpoints

### Credentials

#### Issue a Credential
```http
POST /credentials/issue
Content-Type: application/json

{
  "schema": "web3-bootcamp",
  "recipient": "did:moca:...",
  "data": {
    "courseName": "Advanced Solidity",
    "completionDate": "2024-01-15"
  },
  "issuerDid": "did:moca:issuer:123"
}
```

#### Verify a Credential
```http
POST /credentials/verify
Content-Type: application/json

{
  "proof": { ... },
  "credentialId": "cred_abc123"
}
```

#### Get User Credentials
```http
GET /users/{did}/credentials
```

### Authentication

#### Initialize User Session
```http
POST /auth/init
```

## Error Responses
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

`deployments/moca-testnet.json`
```json
{
  "network": "moca-testnet",
  "contractAddress": "0x...",
  "deployer": "0x...",
  "deployedAt": "2024-01-15T10:00:00Z",
  "contractName": "CredentialRegistry",
  "transactionHash": "0x...",
  "blockNumber": 12345678,
  "implementationAddress": "0x...",
  "verificationStatus": "pending"
}
```

### 🚀 Next Steps for Implementation

1. Install dependencies in each package:
```bash
cd packages/shared-types && npm install && npm run build
cd apps/api && npm install
cd apps/web && npm install  
cd apps/issuer-portal && npm install
```

2. Update environment variables with your Moca Network credentials
3. Start the development servers:
```bash
# From project root
npm run dev
```

4. Test the credential issuance flow using the issuer portal at `http://localhost:3001`