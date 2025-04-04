import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SuperHeroesFormComponent } from '../components/super-heroes/super-heroes-form/super-heroes-form.component';
import { ActionsModalComponent } from '../shared/actions-modal/actions-modal.component';

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<SuperHeroesFormComponent> {
  constructor(private dialog: MatDialog) {}
  canDeactivate(
    component: SuperHeroesFormComponent
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (component.form.dirty && !component.dataSaved) {
      const dialogRef = this.dialog.open(ActionsModalComponent, {
        width: '350px',
        data: {
          title: 'Confirmación de descarte de datos',
          message: 'Tienes cambios no guardados. ¿Estás seguro de que deseas salir?',
          buttonTitle: 'Salir sin guardar'
        }
      });
      return dialogRef.afterClosed();
    }
    return true;
  }
}
