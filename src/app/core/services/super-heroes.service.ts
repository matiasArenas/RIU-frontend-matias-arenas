import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { BehaviorSubject, delay, finalize, Observable, of } from 'rxjs';
import { SuperHeroes } from '../../features/models/super-heroes.model';
import { mockSuperHeroes } from '../../mocks/super-heroes.mock';

@Injectable({
  providedIn: 'root'
})
export class SuperHeroesService {
  private heroesSignal = signal<SuperHeroes[]>(mockSuperHeroes);
  disclaimer!: string;
  spinnerVisible$ = new BehaviorSubject<boolean>(false);

  showSpinner() {
    this.spinnerVisible$.next(true);
  }

  hideSpinner() {
    this.spinnerVisible$.next(false);
  }

  getHeroes(): Observable<SuperHeroes[]> {
    this.showSpinner();
    return of(this.heroesSignal()).pipe(
      delay(1000),
      finalize(() => {
        this.hideSpinner();
      })
    );
  }

  getHeroeById(id: number): Observable<SuperHeroes | undefined> {
    return of(this.heroesSignal().find(hero => hero.id === id));
  }

  createHero(hero: SuperHeroes) {
    const currentHeroes = this.heroesSignal();
    this.heroesSignal.set([...currentHeroes, hero]);
    return of(hero);
  }

  updateHero(hero: SuperHeroes, id: number | null) {
    if (id === null || id === undefined) {
      return of();
    }
    const currentHeroes = this.heroesSignal();
    const index = currentHeroes.findIndex(h => h.id === id);
    if (index !== -1) {
      const updatedHeroes = [...currentHeroes];
      updatedHeroes[index] = hero;
      this.heroesSignal.set(updatedHeroes);
      return of(hero);
    }
    return of();
  }

  deleteHero(id: number) {
    const currentHeroes = this.heroesSignal();
    const index = currentHeroes.findIndex(h => h.id === id);
    if (index !== -1) {
      const updatedHeroes = [...currentHeroes];
      updatedHeroes.splice(index, 1);
      this.heroesSignal.set(updatedHeroes);
      return of(true);
    }
    return of(false);
  }

  searchHeroes = (term: string): Observable<SuperHeroes[]> => {
    if (!term) {
      return of(this.heroesSignal());
    }
    const lowerCaseTerm = term.toLowerCase();
    const result = this.heroesSignal().filter((h) => {
      return (
        h.name.toLowerCase().includes(lowerCaseTerm) || (h.id === Number(term))
      );
    });
    if (result.length > 0) {
      this.disclaimer = '';
      return of(result);
    } else {
      this.disclaimer = 'No existen Héroes para el criterio de búsqueda aplicado, intenta con otra opción';
      return of(this.heroesSignal());
    }
  };
}
