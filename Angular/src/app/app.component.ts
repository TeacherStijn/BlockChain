import {Component, OnInit} from '@angular/core';

import { Block} from '../shared/models/block';
import { Node } from '../shared/models/node';
import { BlockService } from '../shared/services/blockservice';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Transactie} from '../shared/models/transactie';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  blockChain$: Observable<Block[]>;
  openTransacties$: Observable<Transactie[]>;
  nodes$: Observable<Node[]>;

  selectedBlock: Block;
  minedBlock: Block;
  voegToeBlok: boolean = false;
  registratieAan: boolean = true;

  // Beter is het om formsModule te gebruiken;
  zender: string;
  ontvanger: string;
  amount: string;
  node: string;

  constructor(private blockservice: BlockService) {
  }

  ngOnInit() {
    this.blockChain$ = this.blockservice.getChain();
    this.openTransacties$ = this.blockservice.getTransacties();
    this.nodes$ = this.blockservice.getNodes();
  }

  clickRegistreerNode() {
    this.blockservice.postNode(this.node);
  }

  clickNewTransaction() {
    // Forms gebruiken hier is netter (voor o.a. validatie)
    this.blockservice.postTransactie(this.zender, this.ontvanger, this.amount);
    this.voegToeBlok = false;
  }

  clickValidate(){
    this.blockservice.getValidate()
      .subscribe(result=>console.log('Chain gevalideerd'),
        error=>console.log('Validatie aanroep mislukt: ' + error));
  }

  clickMineBlock() {
    console.log('We gaan een block minen...');
    this.blockservice.getMineBlock()
      .subscribe(
        (result) => {
          /*
          if (!result.status) {
            this.minedBlock = <Block>result;
          } else {
            console.log('Er zijn geen transacties');
          }*/
        },
        (error) => { console.log('Ophalen van het geminede block mislukt'); }
      );
  }
}
