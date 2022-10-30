/**
 * This is config for an aptos account,
 * these configs are load from config files, defined in config.ts
 * @interface AptosAccountConfig
 * @member {string} address address of an account, in hex format
 * @member {string} privateKey private key of an account, in hex format
 * @member {gasPrice} gas price when construct tx, the higher gas price, the more chance we get nft
 */
export interface AptosAccountConfig {
  address: string,
  privateKey: string,
  gasPrice: string,
}