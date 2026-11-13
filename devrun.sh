#!/usr/bin/env bash

set -e

red='\x1B[0;31m'
plain='\x1B[0m'

# Check AWS credentials before attempting to start the app
STATUS=$(aws sts get-caller-identity --profile membership 2>&1 || true)
if [[ ${STATUS} =~ (ExpiredToken) ]]; then
  echo -e "${red}Credentials for the membership profile have expired. Please fetch new credentials and run the start script again.${plain}"
  exit 1
elif [[ ${STATUS} =~ ("could not be found") ]]; then
  echo -e "${red}Credentials for the membership profile are missing. Please ensure you have the right credentials.${plain}"
  exit 1
fi

pnpm concurrently \
  --prefix-colors auto \
  --names webpack,sbt \
  "pnpm watch" \
  "sbt run"
