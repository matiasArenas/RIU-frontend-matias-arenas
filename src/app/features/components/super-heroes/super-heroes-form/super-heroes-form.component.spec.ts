import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperHeroesFormComponent } from './super-heroes-form.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { SuperHeroesService } from '../../../../core/services/super-heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SuperHeroes } from '../../../models/super-heroes.model';

class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: (key: string) => key === 'id' ? '1' : null,
    },
  };
}

describe('SuperHeroesFormComponent', () => {
  let component: SuperHeroesFormComponent;
  let fixture: ComponentFixture<SuperHeroesFormComponent>;
  let superHeroesService: jasmine.SpyObj<SuperHeroesService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spySuperHeroesService = jasmine.createSpyObj('SuperHeroesService', [
      'getHeroeById',
      'createHero',
      'updateHero'
    ]);
    const spyRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [SuperHeroesFormComponent, ReactiveFormsModule, MatSnackBarModule, RouterTestingModule],
      providers: [
        { provide: SuperHeroesService, useValue: spySuperHeroesService },
        { provide: Router, useValue: spyRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        FormBuilder
      ]
    });

    fixture = TestBed.createComponent(SuperHeroesFormComponent);
    component = fixture.componentInstance;
    superHeroesService = TestBed.inject(SuperHeroesService) as jasmine.SpyObj<SuperHeroesService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getHeroId and set the form for editing hero', () => {
    const heroId = 1;
    const heroData = { id: 1, name: 'Spiderman' };

    superHeroesService.getHeroeById.and.returnValue(of(heroData));

    component.getHeroId();
    fixture.detectChanges();

    expect(component.isEditMode).toBeTrue();
    expect(component.heroName()).toBe('Spiderman');
    expect(component.heroId()).toBe(1);
    expect(component.form.value.name).toBe('Spiderman');
  });

  it('should set title to "Edición de superhéroes" in edit mode', () => {
    component.isEditMode = true;
    component.setTitle();
    expect(component.title()).toBe('Edición de superhéroes');
  });

  it('should set title to "Alta de superhéroes" in create mode', () => {
    component.isEditMode = false;
    component.setTitle();
    expect(component.title()).toBe('Alta de superhéroes');
  });

  it('should create a new hero when form is valid', () => {
    component.form.setValue({ id: 2, name: 'Iron Man' });
    superHeroesService.createHero.and.returnValue(of());

    component.onSubmit();

    expect(superHeroesService.createHero).toHaveBeenCalledWith({ id: 2, name: 'Iron Man' });
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should update an existing hero when form is valid in edit mode', () => {
    component.isEditMode = true;
    component.heroId.set(1);
    component.form.setValue({ id: 1, name: 'Iron Man' });

    superHeroesService.updateHero.and.returnValue(of());

    component.onSubmit();

    expect(superHeroesService.updateHero).toHaveBeenCalledWith({ id: 1, name: 'Iron Man' }, 1);
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should show snackbar on successful hero creation', () => {
    spyOn(component, 'showSnackbar');

    component.form.setValue({ id: 2, name: 'Iron Man' });
    const mockHero: SuperHeroes = { id: 2, name: 'Iron Man' };
    superHeroesService.createHero.and.returnValue(of(mockHero));
    component.onSubmit();

    expect(component.showSnackbar).toHaveBeenCalledWith('Héroe creado exitosamente', 'Cerrar');
  });

  it('should show snackbar on hero creation failure', () => {
    spyOn(component, 'showSnackbar');

    component.form.setValue({ id: 2, name: 'Iron Man' });
    superHeroesService.createHero.and.returnValue(throwError('Error'));
    component.onSubmit();

    expect(component.showSnackbar).toHaveBeenCalledWith('No se pudo crear el héroe', 'Cerrar');
  });

  it('should navigate to home after submitting form', () => {
    component.form.setValue({ id: 2, name: 'Iron Man' });
    superHeroesService.createHero.and.returnValue(of());

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
});
