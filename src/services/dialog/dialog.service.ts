import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {

  //Bandera para mostrar el dialogo
  private isDialogShown: boolean;
  private title: string;          
  private text: string;           

  constructor() {
    this.isDialogShown = false;
    this.text = '';
    this.title = '';
  }

 
  isShown(): boolean {
    return this.isDialogShown;
  }

  //Muestra el dialogo
  show(title: string, text: string): void {
    this.title = title;
    this.text = text;
    this.isDialogShown = true;
  }

  //Esconde la bandera que muestra el dialogo
  hide(): void {
    this.isDialogShown = false;
  }

  
  getTitle(): string {
    return this.title;
  }

  
  getText(): string {
    return this.text;
  }
}
