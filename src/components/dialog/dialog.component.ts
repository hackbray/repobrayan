import { Component, Input } from '@angular/core';
import { DialogService } from '../../services/dialog/dialog.service'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  @Input() title: string; 
  // Maneja el texto del dialogo      
  @Input() text: string;     
  // Bandera para mostrar el dialogo   
  @Input() dialogShow: boolean; 
  // Bandera para saber si está listo el componente
  isReady: boolean;             

  constructor(
    private dialogService: DialogService
  ) {
  }

  
  //Cierra el evento del dialogo
  cerrar() {
    this.dialogService.hide();
  }
}
