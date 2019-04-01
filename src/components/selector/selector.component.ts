import { ViewEncapsulation } from '@angular/core';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MenuItem } from '../../interfaces/dropdown.interface';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectorComponent implements OnChanges {
  // Listado de elementos a mostrar
  @Input() list: any[];                  
  // Etiqueta de la lista  
  @Input() label: string = '';   
  // Campo del elemento que se va a mostrar                  
  @Input() field: string = 'empty';     
  // Bandera para la carga     
  @Input() isLoading: boolean = true;          
  // Para el evento de cuando el usuario selecciona un elemento.    
  @Output() selectedItemOutput: EventEmitter<any>;  
  // Lista de los elementos del menu
  menuList: MenuItem[];                              

  constructor() {
    this.selectedItemOutput = new EventEmitter<any>();
  }

 
  //Se actualiza el componente cuando la lista cambia
  ngOnChanges(change: SimpleChanges): void {
    if (change && change['list'] && change['list'].currentValue) {
      this.menuList = this.getMenuItems(this.list);
    }
  }

  
  //Emite el nuevo valor y actualiza el elemento seleccionado
  selectedItemEvent(item: any): void {
    this.selectedItemOutput.emit(item.value);
  }

  
  //Retorna la lista de los elementos del menú
  private getMenuItems(list: any[]): MenuItem[] {
    let ret: any[];
    if (list) {
      ret = list.map((elem) => {
        return {
          label: elem[this.field],
          value: elem
        };
      });
    }

    return ret;
  }

}
