import config, {souffl3Config} from '../config';
import {loadAptosAccountsAndConfigs} from '../common/helpers/accounts';
import {AccountSender} from '../core/account-sender';
import { BCS, TxnBuilderTypes} from 'aptos';
import {delay} from '../common/helpers/utils';
import {SOUFFL3_MODULE_FACTORY_ADDRESS} from '../common/constants/souffl3';

const {
  EntryFunction,
  ModuleId,
  Identifier,
  AccountAddress,
} = TxnBuilderTypes;

(async function () {
  const accountsAndConfigs = await loadAptosAccountsAndConfigs()
  const accountSenders = accountsAndConfigs.map(([account, accountConfig]) => new AccountSender(account, accountConfig, config.url));
  const openTime = souffl3Config.time;
  //Add 15 minutes to deadline;
  const deadline = new Date(openTime.getTime() + 15 * 60 * 1000);
  //Minus 1 second to minting time
  const mintingTime = new Date(openTime.getTime() - 1000);

  const entryFunction = new EntryFunction(
    ModuleId.fromStr(SOUFFL3_MODULE_FACTORY_ADDRESS),
    new Identifier(`public_sale_mint`),
    [],
    [
      BCS.bcsToBytes(AccountAddress.fromHex(souffl3Config.collectionAddress)),
      BCS.bcsSerializeStr(souffl3Config.collectionName),
      BCS.bcsSerializeUint64(1),
    ]
  );

  for (const accountSender of accountSenders) {
    await accountSender.buildPreTxEntry(
      entryFunction,
      70000,
      Math.trunc(deadline.getTime() / 1000),
      1,
    );
  }
  for (const accountSender of accountSenders) {
    console.log(accountSender.toString());
  }

  while (true) {
    if (new Date().getTime() < mintingTime.getTime()) {
      console.log(`Not in time yet`);
    } else {
      await Promise.all(
        accountSenders.map((accountSender) => accountSender.submitTx(false))
        //accountSenders.map((accountSender) => accountSender.simulateTx())
      )
    }
    await delay(1000);
  }
})()