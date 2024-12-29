#!/bin/bash

cd "$(dirname "$0")"
cd ../

echo "Disabling Hardhat telemetry..."
export HARDHAT_DISABLE_TELEMETRY=true

echo "Cleaning Hardhat build..."
npx hardhat clean

echo "Deploying Contract to localhost..."
# npx hardhat ignition deploy ./ignition/modules/Lock.ts --network localhost
npx hardhat ignition deploy ./ignition/modules/MedrecAndInsurance.ts --network localhost

# distribute token
npx hardhat run scripts/distributeTokens.ts --network localhost

echo "Deployment complete!"
