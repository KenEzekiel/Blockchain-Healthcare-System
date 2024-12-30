Here’s an improved version of your README that’s more structured, polished, and user-friendly:

---

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
2. Install the dependencies:
   ```bash
   pnpm install
   ```
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

## Demo

A live or recorded demonstration showcasing the Blockchain Healthcare System can be included here. You can provide a link to a hosted demo or embed a video.

---