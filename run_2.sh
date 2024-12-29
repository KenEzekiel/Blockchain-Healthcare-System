#!/bin/bash

echo "deploying contract..."
cd $(pwd)/smart-contract && sh scripts/deploy_contract.sh

echo "Moving ABI..."
sh scripts/move_abi.sh

echo "Running the frontend..."
cd ../healthcare-client && pnpm run dev

echo "Automation number 2 complete!"