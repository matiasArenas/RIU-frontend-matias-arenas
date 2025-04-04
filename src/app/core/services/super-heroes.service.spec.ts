import { TestBed } from '@angular/core/testing';
import { SuperHeroesService } from './super-heroes.service';
import { SuperHeroes } from '../../features/models/super-heroes.model';
import { mockSuperHeroes } from '../../mocks/super-heroes.mock';

describe('SuperHeroesService', () => {
  let service: SuperHeroesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SuperHeroesService]
    });
    service = TestBed.inject(SuperHeroesService);
  });

  it('should show and hide the spinner', () => {
    expect(service.spinnerVisible$.getValue()).toBe(false);

    service.showSpinner();
    expect(service.spinnerVisible$.getValue()).toBe(true);

    service.hideSpinner();
    expect(service.spinnerVisible$.getValue()).toBe(false);
  });

  it('should get hero by id', (done) => {
    const heroId = 1;
    service.getHeroeById(heroId).subscribe(hero => {
      expect(hero?.id).toBe(heroId);

      done();
    });
  });

  it('should create a new hero', (done) => {
    const newHero: SuperHeroes = { id: 999, name: 'New Hero' };
    spyOn(service, 'createHero').and.callThrough();

    service.createHero(newHero).subscribe(hero => {
      expect(hero).toEqual(newHero);
      const heroes = service['heroesSignal']();
      expect(heroes).toContain(newHero);
      done();
    });
  });

  it('should update a hero', (done) => {
    const updatedHero: SuperHeroes = { id: 1, name: 'Updated Hero' };

    service.updateHero(updatedHero, 1).subscribe(hero => {
      expect(hero).toEqual(updatedHero);
      const heroes = service['heroesSignal']();
      expect(heroes[0].name).toBe('Updated Hero');
      done();
    });
  });

  it('should delete a hero', (done) => {
    const heroId = 1;

    spyOn(service, 'deleteHero').and.callThrough();

    service.deleteHero(heroId).subscribe(result => {
      expect(result).toBe(true);
      const heroes = service['heroesSignal']();
      const deletedHero = heroes.find(hero => hero.id === heroId);
      expect(deletedHero).toBeUndefined();
      done();
    });
  });

  it('should search heroes by name', (done) => {
    const searchTerm = 'Batman';

    service.searchHeroes(searchTerm).subscribe(heroes => {
      expect(heroes.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should handle search with no results', (done) => {
    const searchTerm = 'NonExistingHero';

    service.searchHeroes(searchTerm).subscribe(heroes => {
      expect(heroes.length).toBeGreaterThan(0);
      expect(service.disclaimer).toBe('No existen Héroes para el criterio de búsqueda aplicado, intenta con otra opción');
      done();
    });
  });
});
