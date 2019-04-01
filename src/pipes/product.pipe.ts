
import { Pipe, PipeTransform } from '@angular/core';
import { ProductModel } from '../models/product.model';
import { TransactionModel } from '../models/transaction.model';
import { AppConfig } from '../config/app.config';

@Pipe({ name: 'productPipe' })
export class ProductPipe implements PipeTransform {

  transform(list: TransactionModel[], productSelected: ProductModel): TransactionModel[] {
    let ret: TransactionModel[];
    ret = [];
    // Se devuelve toda la lista al seleccionar todos los productos
    if (productSelected && productSelected.name === AppConfig.defaultAllProducts) {
      ret = list;
      // Se filtra por producto
    } else if (productSelected && list && list.length > 0) {
      ret = list.filter((elem) => elem.sku === productSelected.name);
      // Si no se selecciona ningún producto, entonces devuelve vacio
    } else if (list && list.length > 0) {
      ret = list;
    }

    return ret;
  }
}
