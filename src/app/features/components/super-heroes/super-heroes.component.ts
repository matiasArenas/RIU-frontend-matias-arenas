import { AfterViewInit, Component, ViewChild, WritableSignal, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActionsModalComponent } from '../../shared/actions-modal/actions-modal.component';
import { mockSuperHeroes } from '../../../mocks/super-heroes.mock';
import { SuperHeroes } from '../../models/super-heroes.model';
import { SuperHeroesService } from '../../../core/services/super-heroes.service';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from '../../../core/interceptors/interceptor.service';

@Component({
  selector: 'app-super-heroes',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormsModule,
    RouterModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  templateUrl: './super-heroes.component.html',
  styleUrls: ['./super-heroes.component.scss']
})
export class SuperHeroesComponent implements AfterViewInit {
  superHeroesSignal = signal<SuperHeroes[]>(mockSuperHeroes);
  subscription: Subscription = new Subscription();
  loading!: boolean;
  private ngUnsubscribe = new Subject<void>();
  searchInputValue: string = '';
  displayedColumns: string[] = ['id', 'nombre', 'acciones'];
  dataSource = new MatTableDataSource<SuperHeroes>(this.superHeroesSignal());
  searchDisclaimer: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private superHeroesService: SuperHeroesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.setLoader();
    this.getHeroes();
  }

  ngAfterViewInit(): void {
    this.setPaginator();
  }

  setLoader() {
    this.subscription.add(
      this.superHeroesService.spinnerVisible$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((loading) => {
        this.loading = loading;
      })
    );
  }

  getHeroes = (): void => {
    this.superHeroesService.getHeroes().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: SuperHeroes[]) => {
      this.superHeroesSignal.set(data);
      this.dataSource.data = data;
    });
  };

  onSearchChange = (term: string): void => {
    this.superHeroesService.searchHeroes(term).pipe(takeUntil(this.ngUnsubscribe)).subscribe((filteredHeroes: SuperHeroes[]) => {
      this.superHeroesSignal.set(filteredHeroes);
      this.searchDisclaimer = this.superHeroesService.disclaimer;
      this.dataSource.data = this.superHeroesSignal();
    });
  };

  clearSearch = (): void => {
    this.searchInputValue = '';
    this.searchDisclaimer = '';
    this.getHeroes();
  };

  setPaginator = (): void => {
    this.dataSource.paginator = this.paginator;
  };

  openDeleteDialog = (id: number): void => {
    const dialogRef = this.dialog.open(ActionsModalComponent, {
      width: '350px',
      data: {
        title: 'Confirmación de Eliminación',
        message: '¿Estás seguro de que deseas eliminar este héroe?',
        buttonTitle: 'Eliminar'
      }
    });

    this.subscription.add(
      dialogRef.afterClosed().pipe(
        takeUntil(this.ngUnsubscribe)
      ).subscribe((result) => {
        if (result) {
          this.deleteHero(id);
        }
      })
    );
  };

  deleteHero = (id: number): void => {
    this.superHeroesService.deleteHero(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      if (data) {
        this.showSnackbar('Héroe eliminado exitosamente', 'Cerrar');
        this.getHeroes();
      }
    });
  };

  showSnackbar = (message: string, action: string): void => {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
    });
  };

  goToEditHero(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  goToAddNewHero(): void {
    this.router.navigate(['/create']);
  }
}
