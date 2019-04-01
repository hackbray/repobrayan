import { HttpHeaders } from '@angular/common/http';
import { Headers } from '@angular/http';

// Host url

const AppHost = 'assets/resources/';
const kHeader = new HttpHeaders({
  'Accept': 'application/json',
  'Cache-Control': 'private'
});

// App configuration
export const AppConfig = {
  http: {
    transactions: {
      getListOfTransactions: {
        url: AppHost + 'transactions.json',
        headers: kHeader
      }
    },
    rates: {
      getListOfRates: {
        url: AppHost + 'rates.json',
        headers: kHeader
      }
    }
  },
  errors: {
    title: 'Warning',
    text: 'Error. Porfavor intentelo de nuevo'
  },
  defaultCurrency: 'EUR',
  defaultRows: 10,
  defaultNumberFormat: '2.2-4',
  defaultAllProducts: 'Todos los productos'
};
