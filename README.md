# Blockchain-Healthcare-System

Healthcare BPJS System that utilizes blockchain to create a transparent, secure, and decentralized system to manage medical records. Features of this system includes:

1. Insurance Premium Payment
2. Insurance State Check
3. Electronic Medical Record Submission
4. Check & Payment for Medical Checkup
5. Insurance Claim for Medical Checkup Payment
6. Payment using Medical Token

## System Requirements

1. Package Manager (preferably pnpm)
2. Any OS
3. CPU 1-2 Cores (intel i3 minimum)
4. RAM 4 GB
5. Disk Space 10 GB

## Project Description

Consists of three projects:

1. Healthcare Client - Vite + React + TypeScript
2. Smart Contract - Solidity Hardhat TypeScript
3. Oracle - NodeJS

Setup:
```
1. go to each folder `healthcare-client`, `smart-contract`, and `oracle`
2. do `pnpm install` on each folder
3. if you don't have hardhat already, do pnpm install --save-dev hardhat
4. install Solidity extension on vscode
```

Running:
```
frontend
1. pnpm run dev

smart contract
1. run `deploy_chain.bat`
2. run `deploy_contract.bat`
3. run `npx hardhat run scripts/distributeTokens.ts --network localhost`

oracle
1. run `node app.js`
```

## Demo
