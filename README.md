# Blockchain Healthcare System
Healthcare BPJS System that utilizes blockchain to create a transparent, secure, and decentralized system to manage medical records. Features of this system includes:

- **Insurance Premium Payment**
- **Insurance State Check**
- **Electronic Medical Record Submission**
- **Medical Checkup Management**
- **Insurance Claim Management**
- **Medical Token Payments**

---

## System Requirements

To run the Blockchain Healthcare System, ensure your system meets the following requirements:

1. **Operating System**: Any OS (Windows, macOS, Linux)
2. **Processor**: Dual-core CPU (Intel i3 or higher)
3. **Memory**: 4 GB RAM minimum
4. **Disk Space**: 10 GB free space
5. **Dependencies**:
   - [pnpm](https://pnpm.io/installation) package manager
   - [Hardhat](https://hardhat.org/hardhat-runner/docs/getting-started) development environment for Ethereum
6. **Optional**:
   - A shell capable of running `.sh` scripts for automation.
7. **Metamask**: extension or your browser


---

## Project Structure

The system consists of three main components:

1. **Healthcare Client**:
   - **Stack**: Vite, React, TypeScript
   - **Purpose**: Frontend for users to interact with the healthcare system.

2. **Smart Contract**:
   - **Stack**: Solidity, Hardhat, TypeScript
   - **Purpose**: Blockchain backend to manage healthcare data and transactions.

3. **Oracle**:
   - **Stack**: Node.js
   - **Purpose**: Middleware for off-chain operations and data synchronization.

---

## Setup Instructions

Follow these steps to set up and run the project:

1. Clone the repository and navigate to the root folder.

2. Rename the .env.example in the healtcare-client folder to .env

The short way (using scripts)


3. Start the services:

   **Step 1**: In the root folder, run:
   ```bash
   sh run_1.sh
   ```

   **Step 2**: Open a new terminal and run:
   ```bash
   sh run_2.sh
   ```

   **Step 3**: Open another terminal and run:
   ```bash
   sh run_3.sh
   ```
---

The Long way

3.1. Install the dependencies using
   ```bash
   pnpm i
   ```
   in folder healthcare-client, oracle, and smart-Contract

3.2. Run
   ```bash
   npx hardhat node
   ```
   in the smart-contract folder to deploy the chain

3.3. Start a new terminal and run
   ```bash
   sh deploy_contract.sh
   ```
   in the smart-contract folder to deploy the contract

3.3. Run the frontend with
   ```bash
   pnpm run dev
   ```
   In the healthcare-client

3.4. Run the oracle with
   ```bash
   pnpm run dev
   ```
   In the oracle folder


After doing all the initial setup (using the script or the long way) 
4. You need to import a wallet in metamask extension in browser with private key: 
   ```bash
   ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```

5. Type in the browser to go the frontend app
   ```bash
   http://localhost:5173/
   ```

6. Below is the demo of the application that showcase its feature
## Demo

A live or recorded demonstration showcasing the Blockchain Healthcare System can be seen here https://www.youtube.com/watch?v=vn1G-LYHnrw

---
