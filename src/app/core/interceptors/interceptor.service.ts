import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { SuperHeroesService } from '../services/super-heroes.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private superHeroesService: SuperHeroesService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.superHeroesService.showSpinner();
    
    return next.handle(req).pipe(
      finalize(() => {
        this.superHeroesService.hideSpinner();
      })
    );
  }
}