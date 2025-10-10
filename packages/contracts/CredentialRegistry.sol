// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CredentialRegistry is Ownable {
    struct Credential {
        bytes32 schemaId;
        bytes32 programId;
        address recipient;
        string data; // Store data as a flexible string (e.g., JSON)
    }

    mapping(bytes32 => Credential) private credentials;
    bytes32[] private credentialIds;

    event CredentialIssued(
        bytes32 indexed credentialId,
        bytes32 indexed schemaId,
        bytes32 indexed programId,
        address recipient
    );

    constructor() Ownable(msg.sender) {}

    function issueCredential(
        bytes32 schemaId,
        bytes32 programId,
        address recipient,
        string calldata data
    ) external onlyOwner {
        bytes32 credentialId = keccak256(
            abi.encodePacked(schemaId, programId, recipient, data)
        );
        require(
            credentials[credentialId].recipient == address(0),
            "Credential already exists"
        );

        credentials[credentialId] = Credential(
            schemaId,
            programId,
            recipient,
            data
        );
        credentialIds.push(credentialId);

        emit CredentialIssued(credentialId, schemaId, programId, recipient);
    }

    function getCredential(
        bytes32 credentialId
    )
        public
        view
        returns (bytes32, bytes32, address, string memory)
    {
        Credential storage cred = credentials[credentialId];
        require(cred.recipient != address(0), "Credential not found");
        return (cred.schemaId, cred.programId, cred.recipient, cred.data);
    }

    function getCredentialCount() public view returns (uint256) {
        return credentialIds.length;
    }
}