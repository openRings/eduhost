#!/bin/bash

docker compose -f compose.dev.yml up --build --force-recreate $*
