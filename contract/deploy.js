// deploy.js (updated)
// - Loads .env from current folder or parent project root
// - Works with ethers v6, uses safe fallbacks for tx hash and address
require('dotenv').config(); // try default first
const fs = require('fs');
const path = require('path');
const solc = require('solc');
const { ethers } = require('ethers');

// If dotenv didn't pick up vars (e.g. .env lives in parent Next project), load parent .env
if (!process.env.ALCHEMY_SEPOLIA_RPC || !process.env.DEPLOYER_PRIVATE_KEY) {
  const parentEnv = path.join(__dirname, '..', '.env');
  if (fs.existsSync(parentEnv)) {
    require('dotenv').config({ path: parentEnv });
  }
}

async function compileContract(solPath) {
  const source = fs.readFileSync(solPath, 'utf8');
  const input = {
    language: 'Solidity',
    sources: { 'CG-Ballot.sol': { content: source } },
    settings: { outputSelection: { '*': { '*': ['abi','evm.bytecode'] } } }
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  if (output.errors) {
    for (const e of output.errors) {
      if (e.severity === 'error') throw new Error(e.formattedMessage);
      console.warn(e.formattedMessage);
    }
  }
  const contractName = Object.keys(output.contracts['CG-Ballot.sol'])[0];
  const abi = output.contracts['CG-Ballot.sol'][contractName].abi;
  const bytecode = output.contracts['CG-Ballot.sol'][contractName].evm.bytecode.object;
  return { abi, bytecode, contractName };
}

async function main(){
  const solPath = path.join(__dirname, 'CG-Ballot.sol');
  if (!fs.existsSync(solPath)) throw new Error('CG-Ballot.sol not found in contract folder');

  const { abi, bytecode, contractName } = await compileContract(solPath);

  if (!process.env.ALCHEMY_SEPOLIA_RPC) throw new Error('ALCHEMY_SEPOLIA_RPC not set in .env (checked current and parent folder)');
  if (!process.env.DEPLOYER_PRIVATE_KEY) throw new Error('DEPLOYER_PRIVATE_KEY not set in .env (checked current and parent folder)');

  const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA_RPC);
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);

  // Your contract constructor is: constructor(string[] names, string[] infos)
  // For now we pass empty arrays; replace with real initial candidates if you want.
  console.log('Deploying contract (this will create a transaction and wait for it)...');
  const contract = await factory.deploy([], []); // adapt if you want real initial candidates

  // Try safe ways to get tx hash (ethers v6 sometimes doesn't expose the same props)
  const txHash =
    // v6 sometimes has .deploymentTransaction
    (contract.deploymentTransaction && contract.deploymentTransaction.hash) ||
    // fallback to deployTransaction (older property)
    (contract.deployTransaction && contract.deployTransaction.hash) ||
    // if neither present, we can try contract.getDeployTransaction() from factory (not signed) - so mark as unknown
    'unknown';

  console.log('Deployment tx hash (may be "unknown"):', txHash);

  // Wait for the contract to be deployed on chain (v6)
  await contract.waitForDeployment();

  // Address: v6 exposes .target; v5 used .address
  const address = contract.target || contract.address || 'unknown-address';
  console.log(`${contractName} deployed at:`, address);

  // Save ABI + address for frontend/backend
  fs.writeFileSync('deployedBallot.json', JSON.stringify({
    address, abi
  }, null, 2));

  console.log('Saved deployedBallot.json');
}

main().catch(err => {
  console.error('Deployment failed:', err);
  process.exit(1);
});
