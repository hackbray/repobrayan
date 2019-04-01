import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from '../../config/app.config';
import { RateModel } from '../../models/rate.model';
import { CurrencyModel } from '../../models/currency.model';
import { OperationFailure } from '../../models/http.model';

@Injectable()
export class RateService {

  constructor(
    private http: HttpClient
  ) { }

  
  getRateList(): Observable<RateModel[] | OperationFailure> {
    return this.http.get<any>(
      AppConfig.http.rates.getListOfRates.url,
      {
        headers: AppConfig.http.rates.getListOfRates.headers
      })
      .catch((error) => Observable.throw({ message: AppConfig.errors.text }))
  }

  
  getRateValue(
    from: string,
    to: string,
    rateList: RateModel[]): number {
    return this.getRecursiveRateValue(1, from, to, rateList);
  }

  
  private getRecursiveRateValue(
    rate: number,
    from: string,
    to: string,
    rateList: RateModel[]): number {

    let ret: number;

    if (from && to && rateList && rateList.length > 0) {
      // Encuentra el modelo de tarifa seleccionado que coincida con los argumentos que se dieron
      const aux: RateModel = rateList
        .find((elem: RateModel) => elem.from === from && elem.to === to);
      // Si es exitoso se obtiene la tarifa
      if (aux) {
        ret = Number(aux.rate);
      } else {
        // Si no se tiene exito se itera de nuevo
        const fromList = rateList
          .filter((elem: RateModel) => elem.from === from)
          .map((elem) => elem.to);

        const toList = rateList
          .filter((elem: RateModel) => elem.to === to)
          .map((elem) => elem.from);

        if (fromList && fromList.length > 0 && toList && toList.length > 0) {
          const auxRate: string = fromList.find((elem) => toList.indexOf(elem) >= 0);

          // Si se encuentra una conversión directa
          if (auxRate) {
            // Encuentra el modelo de tarifa seleccionado que coincida con los argumentos dados
            const auxRate1: RateModel = rateList
              .find((elem: RateModel) => elem.from === from && elem.to === auxRate);

            const auxRate2: RateModel = rateList
              .find((elem: RateModel) => elem.from === auxRate && elem.to === to);

            // Si se encuentra el enlace de moneda entre y desde
            if (auxRate1 && auxRate2) {
              const rate1 = Number(auxRate1.rate);
              const rate2 = Number(auxRate2.rate);
              if (!Number.isNaN(rate1) && !Number.isNaN(rate2)) {
                ret = rate1 * rate2;
              }
            }

          } else {
            // Si aún no se ha encontrado una conversión directa
            let found: boolean = false;
            for (let i = 0; i < fromList.length && !found; i++) {
              for (let j = 0; j < toList.length && !found; j++) {
                const auxRet = this.getRecursiveRateValue(rate, fromList[i], toList[j], rateList);
                if (auxRet) {
                  ret = rate * auxRet;
                  found = true;
                }
              }
            }
          }
        }
      }
    }

    return ret;
  }
}
