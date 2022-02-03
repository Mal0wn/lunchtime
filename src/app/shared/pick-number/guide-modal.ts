
// modal.ts

import { MatDialogRef } from '@angular/material/dialog';
export class mod{
    public exemple: any;
    constructor( private dialogRef: MatDialogRef<mod>) { }// s'injecte une matDialogRef de lui meme

    emitValue(){ // renvoyer une donnée au parent lors de la fermeture
        this.dialogRef.close(parseFloat(this.exemple));
      }

}

// parent.ts
import { MatDialog } from '@angular/material/dialog';
export class modParent{
    public value: any;
    constructor(private dialog: MatDialog){}

    async displayModal(mode: boolean) { // mode false = solder , true = crediter
        let modal = this.dialog.open(mod, {// Ouverture de la modal
          autoFocus: true // ICI mettre la config ( meme le css si on veut)
        });


        modal.afterClosed().subscribe(// recuperation de la valeur envoyée par mod
          val => { this.value = val; });
      }
}