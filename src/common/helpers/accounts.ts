import {AptosAccountConfig} from '../interfaces/aptos-account-config';
import config from '../../config';
import {loadDataFromFileAsType} from './utils';

async function isValidatedAccountConfig(acc: AptosAccountConfig): Promise<[boolean, string]> {
  return [true, null];
}
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
