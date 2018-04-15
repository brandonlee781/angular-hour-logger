import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'features/login/login.component';

const routes: Routes = [
  {
    path: 'logs',
    loadChildren: 'app/features/log/log.module#LogModule',
  },
  {
    path: 'projects',
    loadChildren: 'app/features/project/project.module#ProjectModule',
  },
  {
    path: 'invoices',
    loadChildren: 'app/features/invoice/invoice.module#InvoiceModule',
  },
  {
    path: 'profile',
    loadChildren: 'app/features/user/user.module#UserModule',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: '/logs',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
