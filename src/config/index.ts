/**
 * This is global config for program to run, make sure check those configs carefully before run application
 * @interface Config
 * @member {[string]} accountConfigs: list of files contains account config
 * @member {string} network: Network we will run on, maybe mainnet or testnet
 * @member {string} url: Url of the fullnode, will be generated automatically be network config
 */
export interface Config {
  accountConfigs: [string],
  network: string,
  url: string,
}