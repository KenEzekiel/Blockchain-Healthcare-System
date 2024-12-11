@echo off
echo Disabling Hardhat telemetry...
set HARDHAT_DISABLE_TELEMETRY=true

echo Cleaning Hardhat build...
call npx hardhat clean

echo Deploying Contract to localhost...
call npx hardhat ignition deploy ./ignition/modules/Lock.ts --network localhost
call npx hardhat ignition deploy ./ignition/modules/MedicalToken.ts --network localhost

echo Deployment complete!
pause
