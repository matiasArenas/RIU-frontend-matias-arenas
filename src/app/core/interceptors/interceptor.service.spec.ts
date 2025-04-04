import { TestBed } from '@angular/core/testing';
import { HttpInterceptorService } from './interceptor.service';
import { SuperHeroesService } from '../services/super-heroes.service';
import { Observable, of } from 'rxjs';

describe('HttpInterceptorService', () => {
  let interceptor: HttpInterceptorService;
  let superHeroesServiceMock: jasmine.SpyObj<SuperHeroesService>;

  beforeEach(() => {
    superHeroesServiceMock = jasmine.createSpyObj('SuperHeroesService', ['showSpinner', 'hideSpinner']);
    TestBed.configureTestingModule({
      providers: [
        HttpInterceptorService,
        { provide: SuperHeroesService, useValue: superHeroesServiceMock },
      ]
    });

    interceptor = TestBed.inject(HttpInterceptorService);
  });

  it('should call showSpinner and hideSpinner during request lifecycle', () => {
    const mockHttpHandler = {
      handle: jasmine.createSpy().and.returnValue(of({} as any))
    };
    interceptor.intercept({} as any, mockHttpHandler).subscribe(() => {
      expect(superHeroesServiceMock.showSpinner).toHaveBeenCalled();

      setTimeout(() => {
        expect(superHeroesServiceMock.hideSpinner).toHaveBeenCalled();
      }, 0);
    });
  });
});
