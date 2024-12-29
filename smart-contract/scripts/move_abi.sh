#!/bin/bash

DESTINATION_FOLDER="../../../healthcare-client/src/abi"

MEDICAL_RECORDS="MedicalRecords"
INSURANCE="Insurance"
PRICE_ORACLE="PriceOracle"
MEDICAL_TOKEN="MedicalToken"
IORACLE="IOracle"

cd "$(dirname "$0")"
cd ../artifacts/contracts
echo "running from $(pwd)"

# Ensure the destination folder exists, create it if it doesn't
if [ ! -d "$DESTINATION_FOLDER" ]; then
    echo "Destination folder '$DESTINATION_FOLDER' does not exist. Creating it..."
    mkdir -p "$DESTINATION_FOLDER"
fi

echo "Moving files contract artifacts to '$DESTINATION_FOLDER'..."

cp $MEDICAL_RECORDS.sol/$MEDICAL_RECORDS.json "$DESTINATION_FOLDER"/
cp $INSURANCE.sol/$INSURANCE.json "$DESTINATION_FOLDER"/
cp $INSURANCE.sol/$IORACLE.json "$DESTINATION_FOLDER"/
cp $PRICE_ORACLE.sol/$PRICE_ORACLE.json "$DESTINATION_FOLDER"/
cp $MEDICAL_TOKEN.sol/$MEDICAL_TOKEN.json "$DESTINATION_FOLDER"/