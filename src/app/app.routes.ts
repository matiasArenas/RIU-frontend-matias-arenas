import { Routes } from '@angular/router';
import { CanDeactivateGuard } from './features/guards/can-deactive.guard';

const routes: Routes = [
  { path: '', redirectTo: '/super-heroes', pathMatch: 'full' },
  
  {
    path: 'super-heroes',
    loadComponent: () => import('../app/features/components/super-heroes/super-heroes.component').then(m => m.SuperHeroesComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('../app/features/components/super-heroes/super-heroes-form/super-heroes-form.component').then(m => m.SuperHeroesFormComponent),
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('../app/features/components/super-heroes/super-heroes-form/super-heroes-form.component').then(m => m.SuperHeroesFormComponent),
    canDeactivate: [CanDeactivateGuard]
  }
];

export default routes;