#!/bin/bash

# Function to open a new terminal and run a command
open_new_terminal() {
    gnome-terminal -- bash -c "$1; exec bash"
}

echo "Starting automation..."

echo "Installing dependencies in healthcare-client..."
cd healthcare-client || exit 1
pnpm i

echo "Installing dependencies in oracle..."
cd ../oracle || exit 1
pnpm i

echo "Installing dependencies in smart-contract..."
cd ../smart-contract || exit 1
pnpm i

echo "Deploying chain..."
echo "Currently in $(pwd)"
sh scripts/deploy_chain.sh

echo "Automation number 1 complete!"
