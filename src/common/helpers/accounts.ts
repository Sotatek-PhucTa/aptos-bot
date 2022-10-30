import {AptosAccountConfig} from '../interfaces/aptos-account-config';
import config from '../../config';
import {loadDataFromFileAsType} from './utils';
import {AptosAccount} from 'aptos';

/**
 * Load account configs from all files defined in config file
 * @function loadAccountConfigs
 * @returns {AptosAccountConfig[]} Array of AptosAccountConfig
 * @throws When have an account defined more than once
 */
async function loadAccountConfigs(): Promise<AptosAccountConfig[]> {
  const accountConfigs: AptosAccountConfig[] = [];
  const definedAccounts: Map<String, String> = new Map<String, String>();
  for (const filePath of config.accountConfigs) {
    console.log(filePath);
    const accs = await loadDataFromFileAsType<AptosAccountConfig[]>(filePath);
    for (const acc of accs) {
      if (definedAccounts.has(acc.address)) {
        throw Error(`Account ${acc.address} defined twice in file ${definedAccounts.get(acc.address)} and ${filePath}`);
      } else {
        definedAccounts.set(acc.address, filePath);
      }
      accountConfigs.push(acc);
    }
  }
  return accountConfigs;
}

/**
 * Load aptos accounts from all files defined in config file
 * @function loadAptosAccounts
 * @returns {AptosAccount[]} List of aptos account
 * @throws When have an account and corresponding private key aren't match
 */
export async function loadAptosAccounts(): Promise<AptosAccount[]> {
  const accounts: AptosAccount[] = [];
  const accountConfigs = await loadAccountConfigs();
  for (const accountConfig of accountConfigs) {
    const aptosAccount = new AptosAccount(Buffer.from(accountConfig.privateKey, 'hex'));
    if (aptosAccount.address().toString() !== accountConfig.address) {
      throw Error(`Account ${accountConfig.address} and private key aren't match`);
    }
    accounts.push(aptosAccount);
  }
  return accounts;
}