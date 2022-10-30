/**
 * This is global config for program to run, make sure check those configs carefully before run application
 * @interface Config
 * @member {[string]} accountConfigs: list of files contains account config
 * @member {string} network: Network we will run on, maybe mainnet or testnet
 */
export interface Config {
  accountConfigs: [string],
  network: string,
}