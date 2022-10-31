import {AptosAccount, AptosClient, TxnBuilderTypes, Types} from 'aptos';
import {AptosAccountConfig} from '../common/interfaces/aptos-account-config';

const {
  AccountAddress,
  ChainId,
  TransactionPayloadEntryFunction,
  RawTransaction,
} = TxnBuilderTypes;


export class AccountSender {
  private client: AptosClient;
  private readonly account: AptosAccount;
  private txns: Uint8Array[];
  private txnSent: number;
  private gasPrice: number;

  constructor(account: AptosAccount, accountConfig: AptosAccountConfig, url: string) {
    this.account = account;
    this.client = new AptosClient(url);
    this.gasPrice = parseInt(accountConfig.gasPrice);
  }

  async buildPreTxEntry(
    entryFunctionPayload: TxnBuilderTypes.EntryFunction,
    maxGasUnit: number,
    expireTime: number,
    numberOfTx: number,
  ) {
    this.txns = [];
    this.txnSent = 0;
    const [{ sequence_number: sequenceNumber }, chainId] = await Promise.all([
      this.client.getAccount(this.account.address()),
      this.client.getChainId(),
    ]);
    for (let i = 0; i< numberOfTx; i++) {
      const rawTx = new RawTransaction(
        AccountAddress.fromHex(this.account.address()),
        BigInt(sequenceNumber + i),
        new TransactionPayloadEntryFunction(entryFunctionPayload),
        BigInt(maxGasUnit),
        BigInt(this.gasPrice),
        BigInt(expireTime),
        new ChainId(chainId),
      )
      this.txns.push(AptosClient.generateBCSTransaction(this.account, rawTx));
    }
  }

  async submitTx(waitForSuccess) {
    if (this.txnSent < this.txns.length) {
      const txSent = await this.client.submitSignedBCSTransaction(this.txns[this.txnSent]);
      if (waitForSuccess) await this.client.waitForTransaction(txSent.hash);
      this.txnSent += 1;
    }
    console.log(`Account ${this.account.address().hex()} sent all txn`);
  }

  toString(): string {
    return `Account ${this.account.address()} with url ${this.client.nodeUrl} and gas price ${this.gasPrice}, have ${this.txns.length} prebuilt tx`;
  }
}