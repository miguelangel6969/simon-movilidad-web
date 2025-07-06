import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ],
  templateUrl: './historial-modal.component.html',
  styleUrl: './historial-modal.component.css',
})
export class HistorialModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public datos: any[],
    private dialogRef: MatDialogRef<HistorialModalComponent>
  ) {}

  cerrar(): void {
    this.dialogRef.close(); // puedes pasar un valor si deseas
  }
}
