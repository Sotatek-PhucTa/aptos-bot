import configData from "./config.json";
import {MAINNET_URL, TESTNET_URL} from '../common/constants/aptos';

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
  config.url = configData["mainnetUrl"] === "" ?
    MAINNET_URL :
    configData["mainnetUrl"];
} else if (config.network === 'testnet') {
  config.url = configData['testnetUrl'] === '' ?
    TESTNET_URL :
    configData['testnetUrl'];
} else throw Error('Invalid network config, must be "mainnet" or "testnet"');

export default config;