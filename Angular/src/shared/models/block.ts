import * as SHA256 from 'crypto-js/sha256';

export class Block {

  constructor (public index, public timestamp, public transactions, public pow, public previousHash = '', public hash) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.pow = pow;
    this.previousHash = previousHash;
    this.hash = hash;
    //this.hash = this.calculateHash();
  }

  toJSON() {
    return {
      "index": this.index,
      "timestamp": this.timestamp,
      "transactions": this.transactions,
      "pow": this.pow,
      "previousHash": this.previousHash,
      "hash": this.hash
    };
  }

  /*
  calculateHash() {
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions)).toString();
  }
  */
}
