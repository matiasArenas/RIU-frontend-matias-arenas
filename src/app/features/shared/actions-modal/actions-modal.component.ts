import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-actions-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './actions-modal.component.html',
  styleUrls: ['./actions-modal.component.scss']
})
export class ActionsModalComponent {
  title!: string;
  message!: string;
  buttonTitle!: string;
  constructor(
    private dialogRef: MatDialogRef<ActionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string, buttonTitle: string }
  ) {
    if (data) {
      this.title = data.title || 'Eliminar Heroe';
      this.message = data.message || '¿Deseas eliminar el héroe seleccionado?';
      this.buttonTitle = data.buttonTitle || 'Eliminar';
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
