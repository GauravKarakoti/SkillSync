async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);

  const CredentialRegistry = await ethers.getContractFactory("CredentialRegistry");
  const credentialRegistry = await CredentialRegistry.deploy();
  
  await credentialRegistry.waitForDeployment();
  const credentialRegistryAddress = await credentialRegistry.getAddress();
  
  console.log("CredentialRegistry deployed to:", credentialRegistryAddress);
  
  // Save deployment info
  const fs = require('fs');
  const deploymentInfo = {
    network: 'moca-testnet',
    contractAddress: credentialRegistryAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync('../deployments/moca-testnet.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("Deployment info saved to deployments/moca-testnet.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });