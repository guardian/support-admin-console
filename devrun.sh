#!/usr/bin/env bash

pnpm concurrently \
  --prefix-colors auto \
  --names webpack,sbt \
  "pnpm watch" \
  "sbt run"
