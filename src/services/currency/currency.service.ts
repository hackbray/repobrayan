import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from '../../config/app.config';
import { RateModel } from '../../models/rate.model';
import { CurrencyModel } from '../../models/currency.model';
import { OperationFailure } from 'models/http.model';

@Injectable()
export class CurrencyService {

  
  getCurrencyList(rates: RateModel[]): Observable<CurrencyModel[] | OperationFailure> {
    return Observable.if(() => rates !== undefined,
      Observable.of(this.extractCurrencies(rates)),
      Observable.throw({ message: AppConfig.errors.text }));
  }

  
  //Obtiene todas las divisas desde el modelo de divisas 
  private extractCurrencies(list: RateModel[]): CurrencyModel[] {
    return list
      .map((elem) => elem.from)
      .filter((elem, index, self) => index === self.indexOf(elem))
      .map((elem) => { return { name: elem } });
  }
}
