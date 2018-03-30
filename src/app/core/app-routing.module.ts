import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'features/login/login.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: 'app/features/log/log.module#LogModule',
  },
  {
    path: 'projects',
    loadChildren: 'app/features/project/project.module#ProjectModule',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
