import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/modulos/login/login.component';
import {DashboardComponent} from './componentes/modulos/dashboard/dashboard.component';
import {PageNotFoundComponent} from './componentes/layauts/pagenofound/pagenofound.component';
import {AuthGuard} from './core/guards/AuthGuard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
