#!/bin/bash

cd game
yarn
yarn build
yarn unlink
yarn link
cd ../server
yarn
yarn link polywar
cd ../ui/web
yarn
yarn link polywar