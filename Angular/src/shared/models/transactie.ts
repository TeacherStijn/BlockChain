export class Transactie {
  constructor(public zender, public ontvanger, public amount) {
    this.zender = zender;
    this.ontvanger = ontvanger;
    this.amount = amount;
  }
}
