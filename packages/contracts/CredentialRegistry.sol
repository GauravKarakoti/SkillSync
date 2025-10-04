// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CredentialRegistry {
    struct Credential {
        address issuer;
        address recipient;
        bytes32 schemaId;
        bytes32 credentialHash;
        uint256 issuedAt;
        uint256 revokedAt;
        bool isActive;
    }
    
    mapping(bytes32 => Credential) public credentials;
    mapping(address => bool) public authorizedIssuers;
    mapping(bytes32 => bool) public usedHashes;
    
    address public admin;
    
    event CredentialIssued(
        bytes32 indexed credentialId,
        address indexed issuer,
        address indexed recipient,
        bytes32 schemaId,
        uint256 issuedAt
    );
    
    event CredentialRevoked(bytes32 indexed credentialId, uint256 revokedAt);
    event IssuerAuthorized(address indexed issuer);
    event IssuerRemoved(address indexed issuer);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }
    
    modifier onlyIssuer() {
        require(authorizedIssuers[msg.sender], "Not authorized issuer");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        authorizedIssuers[msg.sender] = true;
    }
    
    function issueCredential(
        address recipient,
        bytes32 schemaId,
        bytes32 credentialHash
    ) external onlyIssuer returns (bytes32) {
        require(recipient != address(0), "Invalid recipient");
        require(schemaId != bytes32(0), "Invalid schema");
        require(credentialHash != bytes32(0), "Invalid credential hash");
        require(!usedHashes[credentialHash], "Credential hash already used");
        
        bytes32 credentialId = keccak256(
            abi.encodePacked(msg.sender, recipient, schemaId, credentialHash, block.timestamp)
        );
        
        credentials[credentialId] = Credential({
            issuer: msg.sender,
            recipient: recipient,
            schemaId: schemaId,
            credentialHash: credentialHash,
            issuedAt: block.timestamp,
            revokedAt: 0,
            isActive: true
        });
        
        usedHashes[credentialHash] = true;
        
        emit CredentialIssued(credentialId, msg.sender, recipient, schemaId, block.timestamp);
        return credentialId;
    }
    
    function revokeCredential(bytes32 credentialId) external onlyIssuer {
        Credential storage cred = credentials[credentialId];
        require(cred.issuer == msg.sender, "Not the original issuer");
        require(cred.isActive, "Credential already revoked");
        
        cred.isActive = false;
        cred.revokedAt = block.timestamp;
        
        emit CredentialRevoked(credentialId, block.timestamp);
    }
    
    function verifyCredential(bytes32 credentialId) external view returns (bool) {
        Credential memory cred = credentials[credentialId];
        return cred.isActive && cred.issuer != address(0);
    }
    
    function addIssuer(address issuer) external onlyAdmin {
        require(issuer != address(0), "Invalid issuer address");
        authorizedIssuers[issuer] = true;
        emit IssuerAuthorized(issuer);
    }
    
    function removeIssuer(address issuer) external onlyAdmin {
        authorizedIssuers[issuer] = false;
        emit IssuerRemoved(issuer);
    }
    
    function getCredential(bytes32 credentialId) external view returns (Credential memory) {
        return credentials[credentialId];
    }
}