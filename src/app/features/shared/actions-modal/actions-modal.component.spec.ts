import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionsModalComponent } from './actions-modal.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

describe('ActionsModalComponent', () => {
  let component: ActionsModalComponent;
  let fixture: ComponentFixture<ActionsModalComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ActionsModalComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ActionsModalComponent, MatDialogModule, MatButtonModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { title: 'Confirmación', message: '¿Estás seguro?', buttonTitle: 'Aceptar' } },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties from injected data', () => {
    expect(component.title).toBe('Confirmación');
    expect(component.message).toBe('¿Estás seguro?');
    expect(component.buttonTitle).toBe('Aceptar');
  });

  it('should call dialogRef.close(true) on onConfirm', () => {
    component.onConfirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should call dialogRef.close(false) on onCancel', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });
});
