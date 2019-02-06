import { Injectable } from '@angular/core';

import { Block } from '../models/block';
import { Node } from '../models/node';

import {HttpClient} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import {Transactie} from '../models/transactie';

@Injectable()

export class BlockService {
  port = '8001';

  constructor(private http: HttpClient) {}

  getChain(): Observable<Block[]> {
    return this.http.get<Block[]>('http://localhost:' + this.port + '/chain');
  }

  getTransacties(): Observable<Transactie[]> {
    return this.http.get<Transactie[]>('http://localhost:' + this.port + '/transacties');
  }

  getNodes(): Observable<Node[]> {
    return this.http.get<Node[]>('http://localhost:' + this.port + '/nodes');
  }

  postNode(node) {
    console.log(`${node} wordt zo toegevoegd... `);
    this.http.post<Node>('http://localhost:' + this.port + '/nodes/registreer',
      {
        node: node
      }).subscribe(
      (result) => { console.log(`posten data gelukt met resultaat: ${JSON.stringify(result)}`); },
      (error) => { console.log('iets met posten mis gegaan: ' + error.status); }
    );
  }

  postTransactie(zender, ontvanger, amount) {
    console.log(`Transactie wordt zo toegevoegd...
                ${zender} en ${ontvanger} en ${amount}`);
    this.http.post<Transactie[]>('http://localhost:' + this.port + '/transacties/nieuw',
      {
        "zender": zender,
        "ontvanger": ontvanger,
        "amount": amount
      }).subscribe(
      (result) => { console.log(`posten data gelukt met resultaat: ${JSON.stringify(result)}`); },
      (error) => { console.log('iets met posten mis gegaan: ' + error); }
    );
  }

  getValidate(): Observable<any> {
    return this.http.get('http://localhost:' + this.port + '/nodes/structure');
  }

  getMineBlock(): Observable<any> {
    return this.http.get ('http://localhost:' + this.port + '/minen');
  }
}
