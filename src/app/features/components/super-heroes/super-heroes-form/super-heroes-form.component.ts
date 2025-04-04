import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SuperHeroesService } from '../../../../core/services/super-heroes.service';


@Component({
  selector: 'app-super-heroes-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterModule],
  templateUrl: './super-heroes-form.component.html',
  styleUrl: './super-heroes-form.component.scss'
})
export class SuperHeroesFormComponent {
  form!: FormGroup;
  isEditMode = false;
  title = signal<string>('');
  heroName = signal<string>('');
  heroId = signal<number | null>(0);
  dataSaved = false;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private superHeroesService: SuperHeroesService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      id: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
    });
  }

  ngOnInit(): void {
    this.getHeroId();
    this.setTitle();
    this.setForm();
  }

  setForm() {
    const id = this.heroId();
    const name = this.heroName();
    this.form.setValue({
      id: id || '',
      name: name || '',
    });
  }

  getHeroId() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.superHeroesService.getHeroeById(+id).subscribe((data) => {
        if (data) {
          this.heroName.set(data.name);
          this.heroId.set(data.id);
        }
      });
    }
    this.setTitle();
  }

  setTitle = () => {
    this.title.set(this.isEditMode ? 'Edición de superhéroes' : 'Alta de superhéroes');
  };

  onSubmit = (): void => {
    if (this.form.valid) {
      const formValue = this.form.value;
  
      if (this.isEditMode) {
        this.superHeroesService.updateHero(formValue, this.heroId()).subscribe({
          next: (data) => {
            this.dataSaved = true;
            this.showSnackbar('Héroe editado exitosamente', 'Cerrar');
          },
          error: (err) => {
            this.dataSaved = false;
            this.showSnackbar('No se pudo editar el héroe', 'Cerrar');
          }
        });
      } else {
        this.superHeroesService.createHero(formValue).subscribe({
          next: (data) => {
            this.dataSaved = true;
            this.showSnackbar('Héroe creado exitosamente', 'Cerrar');
            this.router.navigate(['']);
          },
          error: (err) => {
            this.dataSaved = false;
            this.showSnackbar('No se pudo crear el héroe', 'Cerrar');
          }
        });
      }
    }
    this.goToHome();
  };
  

  showSnackbar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'left',
      verticalPosition: 'bottom',
    });
  }

  goToHome() {
    this.router.navigate(['']);
  }
}
