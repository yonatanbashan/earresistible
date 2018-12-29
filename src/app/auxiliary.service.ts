import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { Injectable } from '@angular/core';

@Injectable()
export class AuxiliaryService {

  constructor(
    public dialog: MatDialog
  ) {}

  openDialog(title:string, content: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{
      data: {
        title: title,
        content: content
      },
    });

    return dialogRef.afterClosed();
  }


}
