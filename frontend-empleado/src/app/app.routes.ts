import { Routes } from '@angular/router';
import { EmpleadosComponent } from './empleados/empleados';

export const routes: Routes = [
  { path: '', redirectTo: 'empleados', pathMatch: 'full' },
  { path: 'empleados', component: EmpleadosComponent }
];
