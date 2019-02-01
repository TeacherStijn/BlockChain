import {Block} from '../block';

import * as SHA256 from 'crypto-js/sha256';
import {Transactie} from "../transactie";

export class BlockChain {
  static difficulty: number;
  chain: Block[];
  currentTransactions = [];

  constructor() {
    this.chain = [this.createGenesisBlock()];
    BlockChain.difficulty = 4;
  }

  static hash(block: Block) {
    return SHA256(block.index + block.previousHash + block.timestamp + JSON.stringify(block.transactions)).toString();
  }


  createGenesisBlock() {
    var genesis = new Block(0, new Date(), [new Transactie('Genesis blokje', 'Genesis blokje', 1)], '0', '0', '0');
    genesis.hash = SHA256(genesis.index + genesis.previousHash + genesis.timestamp + JSON.stringify(genesis.transactions)).toString();
    return genesis;
  }


  isVerified(): boolean {
    for (let i = 1; i < this.chain.length; i++)
    {
      const huidig = this.chain[i];
      const vorige = this.chain[i - 1];

      // valideer hashcode:
      /* if (huidig.hash !== huidig.calculateHash()) {
        return false;
      }*/

      // valideer vorige hash op huidige block met vorige block hash:
      if (huidig.previousHash !== BlockChain.hash(vorige)) {
        return false;
      }
    }

    return true;
  }
}
