import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperHeroesComponent } from './super-heroes.component';
import { SuperHeroesService } from '../../../core/services/super-heroes.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { mockSuperHeroes } from '../../../mocks/super-heroes.mock';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

describe('SuperHeroesComponent', () => {
  let component: SuperHeroesComponent;
  let fixture: ComponentFixture<SuperHeroesComponent>;
  let superHeroesService: SuperHeroesService;
  let dialog: MatDialog;
  let snackBar: MatSnackBar;
  let router: Router;
  let dialogRefMock: any;
  beforeEach(async () => {
    dialogRefMock = {
      afterClosed: jasmine.createSpy().and.returnValue(of(true)),
      close: jasmine.createSpy()
    };
    await TestBed.configureTestingModule({
      imports: [
        SuperHeroesComponent,
        MatPaginatorModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatDialogModule,
      ],
      providers: [
        {
          provide: SuperHeroesService,
          useValue: {
            spinnerVisible$: new BehaviorSubject<boolean>(false),
            getHeroes: () => of(mockSuperHeroes),
            searchHeroes: (term: string) => of(mockSuperHeroes),
            deleteHero: (id: number) => of(true),
            disclaimer: '',
          },
        },
        { provide: MatDialog, useValue: { open: jasmine.createSpy('open') } },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperHeroesComponent);
    component = fixture.componentInstance;
    superHeroesService = TestBed.inject(SuperHeroesService);
    dialog = TestBed.inject(MatDialog);
    snackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set loading state when spinnerVisible$ changes', () => {
    superHeroesService.spinnerVisible$.next(true);
    expect(component.loading).toBe(true);
    superHeroesService.spinnerVisible$.next(false);
    expect(component.loading).toBe(false);
  });

  it('should call getHeroes and set dataSource', () => {
    spyOn(superHeroesService, 'getHeroes').and.callThrough();
    component.getHeroes();
    expect(superHeroesService.getHeroes).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockSuperHeroes);
  });

  it('should search heroes correctly and update dataSource', () => {
    const term = 'Iron';
    spyOn(superHeroesService, 'searchHeroes').and.callThrough();
    component.onSearchChange(term);
    expect(superHeroesService.searchHeroes).toHaveBeenCalledWith(term);
    expect(component.dataSource.data).toEqual(mockSuperHeroes);
  });

  it('should clear search and call getHeroes', () => {
    spyOn(component, 'getHeroes');
    component.clearSearch();
    expect(component.getHeroes).toHaveBeenCalled();
    expect(component.searchInputValue).toBe('');
    expect(component.searchDisclaimer).toBe('');
  });

  it('should navigate to the edit page when goToEditHero is called', () => {
    component.goToEditHero('1');
    expect(router.navigate).toHaveBeenCalledWith(['/edit', '1']);
  });

  it('should navigate to the create page when goToAddNewHero is called', () => {
    component.goToAddNewHero();
    expect(router.navigate).toHaveBeenCalledWith(['/create']);
  });

  afterEach(() => {
    if (component.subscription) {
      component.subscription.unsubscribe();
    }
  });
});
