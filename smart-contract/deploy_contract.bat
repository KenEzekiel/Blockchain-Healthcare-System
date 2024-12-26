@echo off
echo Disabling Hardhat telemetry...
set HARDHAT_DISABLE_TELEMETRY=true

echo Cleaning Hardhat build...
call npx hardhat clean

echo Deploying Contract to localhost...
call npx hardhat ignition deploy ./ignition/modules/Insurance.ts --network localhost
call npx hardhat ignition deploy ./ignition/modules/MedicalToken.ts --network localhost
call npx hardhat ignition deploy ./ignition/modules/MedicalRecords.ts --network localhost --parameters ./ignition/parameters/localhost.json


echo Deployment complete!
pause
