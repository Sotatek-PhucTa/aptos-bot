import configData from "./config.json";
import blueMoveData from "./blue-move.json";
import souffl3Data from "./souffl3.json";
import {MAINNET_URL, TESTNET_URL} from '../common/constants/aptos';
import {isEmptyValue} from '../common/helpers/utils';

/**
 * This is global config for program to run, make sure check those configs carefully before run application
 * @interface Config
 * @member {[string]} accountConfigs: list of files contains account config
 * @member {string} network: Network we will run on, maybe mainnet or testnet
 * @member {string} url: Url of the fullnode, will be generated automatically be network config
 */
export interface Config {
  accountConfigs: string[],
  network: string,
  url: string,
}

const config: Config = ({} as any) as Config;

config.accountConfigs = configData["accountConfigs"]
config.network = configData["network"];
if (config.network === 'mainnet') {
  config.url = isEmptyValue(configData["mainnetUrl"]) ?
    MAINNET_URL :
    configData["mainnetUrl"];
} else if (config.network === 'testnet') {
  config.url = isEmptyValue(configData['testnetUrl']) ?
    TESTNET_URL :
    configData['testnetUrl'];
} else throw Error('Invalid network config, must be "mainnet" or "testnet"');

export default config;


/**
 * This is config for bluemove bot to automatically mint nft
 * @interface BlueMoveConfig
 * @member {string} factoryAddress: Address of factory of collection, each collection will have a factory,
 * user must have to update this address before minting new any collection
 * @member {Date} time: Time the collection will open
 */
export interface BlueMoveConfig {
  factoryAddress: string,
  time: Date,
}

const blueMoveConfig: BlueMoveConfig = ({} as any) as BlueMoveConfig;
blueMoveConfig.factoryAddress = blueMoveData["factoryAddress"];
blueMoveConfig.time = new Date(blueMoveData["time"]);

/**
 * This is config for souffl3 bot to automatically mint nft
 * @interface Souffl3Config
 * @member {string} collectionAddress: Address of collection
 * @member {string} collectionName: Name of the collection
 * @member {Date} time: Time the collection will open
 */
export interface Souffl3Config {
  collectionAddress: string,
  collectionName: string,
  time: Date,
}

const souffl3Config: Souffl3Config = ({} as any) as Souffl3Config;
souffl3Config.collectionAddress = souffl3Data['collectionAddress'];
souffl3Config.collectionName = souffl3Data['collectionName'];
souffl3Config.time = new Date(souffl3Data['time']);

export { blueMoveConfig, souffl3Config };