import {AptosAccount, AptosClient, TxnBuilderTypes, Types} from 'aptos';

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

  constructor(account: AptosAccount, url: string) {
    this.account = account;
    this.client = new AptosClient(url);
  }

  async buildPreTxEntry(
    entryFunctionPayload: TxnBuilderTypes.EntryFunction,
    maxGasUnit: number,
    gasPrice: number,
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
        BigInt(gasPrice),
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
    }
    this.txnSent += 1;
  }
}