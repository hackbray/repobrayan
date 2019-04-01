import { Component, ViewEncapsulation } from '@angular/core';
import { TransactionModel } from '../../models/transaction.model';
import { ProductModel } from '../../models/product.model';
import { RateModel } from '../../models/rate.model';
import { CurrencyModel } from '../../models/currency.model';
import { TransactionService } from '../../services/transactions/transaction.service';
import { ProductService } from '../../services/product/product.service';
import { RateService } from '../../services/rate/rate.service';
import { CurrencyService } from '../../services/currency/currency.service';
import { DialogService } from '../../services/dialog/dialog.service';
import { ProductPipe } from '../../pipes/product.pipe';
import { AppConfig } from '../../config/app.config';
import { CurrencyPipe } from '@angular/common';
import { MenuItem } from '../../interfaces/dropdown.interface';
import { OperationFailure } from '../../models/http.model';
import { Observable } from 'rxjs/Observable';
import { ComponentLoader } from '../../models/common.model';

@Component({
  selector: 'app-root',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardPageComponent {

  transactionList: TransactionModel[];                            
  productList: ProductModel[];                                    
  productSelected: ProductModel;                                  
  currencyList: CurrencyModel[];                                  
  currencySelected: CurrencyModel;                                
  // Texto por defecto
  readonly allProducts: string = AppConfig.defaultAllProducts;   
  // Filas por defecto 
  readonly rows: number = AppConfig.defaultRows;
  // Formato de número por defecto
  readonly numberFormat: string = AppConfig.defaultNumberFormat;  
  // Componentes de cargas
  isLoading: ComponentLoader;                                     
  // Lista de intercambio de divisas
  private rateList: RateModel[];                                  

  constructor(
    private transactionService: TransactionService,
    private productService: ProductService,
    private rateService: RateService,
    private currencyService: CurrencyService,
    private productPipe: ProductPipe,
    public dialogService: DialogService
  ) {
    // Inicialización de los cargadores
    this.updateLoaders(true);

    // Declaración de las solicitudes para obtener los datos
    let requests;
    requests = [];
    requests.push(
      // Obtener el listado de la transacción
      this.transactionService.getTransactionsList()
        .flatMap((data: TransactionModel[]) => {
          this.transactionList = data;
          this.isLoading.transactionList = false;
          return this.productService.getProductList(data);
        })
        // Obtiene el listado de los productos
        .map((data: ProductModel[]) => {
          this.productList = data;
          // Envia el valor predeterminado, es decir todos los productos.
          if (this.productList.length > 0) {
            this.productSelected = { name: this.allProducts };
            this.productList.unshift(this.productSelected);
          }
          this.isLoading.productList = false;
        }));

    // Obtiene la lista de las tasas
    requests.push(this.rateService.getRateList()
      .flatMap((data: RateModel[]) => {
        this.rateList = data;
        this.isLoading.rateList = false;
        return this.currencyService.getCurrencyList(data);
      })
      // Obtiene el listado de divisas
      .map((data: CurrencyModel[]) => {
        this.currencyList = data;
        // Setea el euro como moneda predeterminada y lo ingresa al principio de la matriz
        if (this.currencyList.length > 0) {
          this.currencySelected = this.currencyList.find((elem: CurrencyModel) => elem.name === AppConfig.defaultCurrency);
          if (this.currencySelected) {
            this.currencyList.splice(this.currencyList.indexOf(this.currencySelected), 1);
            this.currencyList.unshift(this.currencySelected);
          } else {
            this.currencySelected = this.currencyList[0];
          }
        }
        this.isLoading.currencyList = false;
      }));

    // Envia todas las solicitudes
    Observable.forkJoin(requests)
      .subscribe(undefined,
      // Mensaje de error para cuando falle
      (error: OperationFailure) => {
        // Actualiza los cargadores
        this.updateLoaders(false);
        this.dialogService.show(AppConfig.errors.title, error.message);
      });
  }

  
  selectedProduct(item: ProductModel): void {
    this.productSelected = item;
  }

 
  selectedCurrency(item: CurrencyModel): void {
    this.currencySelected = item;
  }

  
  getTotalAmount(): number {
    let ret: number;

    // Obtiene la cantidad total de todos los productos
    if (this.productSelected && this.productSelected.name === this.allProducts) {
      ret = 0;
      for (let i = 0; i < this.productList.length; i++) {
        ret = ret + this.transactionService.getTotalAmount(
          this.productList[i],
          this.transactionList,
          this.currencySelected,
          this.rateList);
      }
      // Obtener la cantidad total para un producto especifico
    } else {
      ret = this.transactionService.getTotalAmount(
        this.productSelected,
        this.transactionList,
        this.currencySelected,
        this.rateList);
    }

    return ret;
  }

 
  getTotalSales(): number {
    let ret: number;
    // Obtiene el total de ventas para todos los productos
    if (this.productSelected && this.productSelected.name === this.allProducts) {
      ret = 0;
      for (let i = 0; i < this.productList.length; i++) {
        ret = ret + this.transactionService.getTotalSales(
          this.productList[i],
          this.transactionList);
      }
      // Obtiene el total de ventas para un producto especifico
    } else {
      ret = this.transactionService.getTotalSales(
        this.productSelected,
        this.transactionList);
    }

    return ret;
  }

  
  enableProductName(): boolean {
    return !this.productSelected || (this.productSelected && this.productSelected.name === AppConfig.defaultAllProducts);
  }

  
  private updateLoaders(value: boolean): void {
    this.isLoading = {
      transactionList: value,
      productList: value,
      rateList: value,
      currencyList: value
    };
  }


  private getCurrencySymbol(): string {
    let ret: string;

    if (this.currencySelected) {
      ret = this.currencySelected.name;
    } else {
      ret = AppConfig.defaultCurrency;
    }

    return ret;
  }
}
