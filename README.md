This repo includes script to run bot to interact to Aptos network, user will need to config some json files before running.

All important config will be defined in `src/config/config.json`.

Firstly, all account for interacting to network must be defined in json files, default location: `src/config/accounts/`. These files location will be defined in `accountConfigs` fields in global `config.json` file.

<h3>Mint nft blue-move </h3>
1. To run mint nft blue move bot, user first need to update config in `src/config/blue-move.json`, includes:
    - `factoryAddress` : Address of factory of the token, can get manually from `bluemove.net`
    - `time`: Time the collection will open

2. Run command: `ts-node src/scripts/bluemove-bot.ts`.

Note that script first only mint public collection, and if collection requires Twitter verified account, user must verify by hand.

<h3>Mint nft souffl3</h3>
1. To run mint nft souffl3, user first need to update config in `src/config/souffl3.json`, includes:
   - `collectionAddress`: Address of the collection
   - `collectionName`: Name of the collection
   - `time`: Time the collection will open
2. Run command: `ts-node src/scripts/souffl3-bot.ts`