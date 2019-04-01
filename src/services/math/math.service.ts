import { Injectable } from '@angular/core';

@Injectable()
export class MathService {

 
  roundHalfEven(amount: number): number {
    return 2 * Math.round(100 * amount / 2) / 100;
  }
}
