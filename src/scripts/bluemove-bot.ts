import {TxnBuilderTypes, BCS} from 'aptos';
import {loadAptosAccountsAndConfigs} from '../common/helpers/accounts';
import config, { blueMoveConfig } from '../config';
import {AccountSender} from '../core/account-sender';
import {delay} from '../common/helpers/utils';

const {
  EntryFunction,
  ModuleId,
  Identifier,
} = TxnBuilderTypes;

(async function () {
  const accountsAndConfigs = await loadAptosAccountsAndConfigs()
  const accountSenders = accountsAndConfigs.map(([account, accountConfig]) => new AccountSender(account, accountConfig, config.url));
  const openTime = blueMoveConfig.time;
  //Add 15 minutes to deadline;
  const deadline = new Date(openTime.getTime() + 15 * 60 * 1000);
  //Minus 1 second to minting time
  const mintingTime = new Date(openTime.getTime() - 1000);

  const entryFunction = new EntryFunction(
    ModuleId.fromStr(`${blueMoveConfig.factoryAddress}::factory`),
    new Identifier(`mint_with_quantity`),
    [],
    [BCS.bcsSerializeUint64(1)]
  );

  for (const accountSender of accountSenders) {
    await accountSender.buildPreTxEntry(
      entryFunction,
      70000,
      Math.trunc(deadline.getTime() / 1000),
      2,
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
      )
    }
    await delay(1000);
  }
})()