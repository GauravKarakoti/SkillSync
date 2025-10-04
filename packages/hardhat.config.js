require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    "moca-testnet": {
      url: process.env.MOCA_RPC_URL || "https://testnet-rpc.mocachain.org/",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: parseInt(process.env.MOCA_CHAIN_ID || "222888"),
    },
  },
};
