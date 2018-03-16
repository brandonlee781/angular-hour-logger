import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HeroesComponent } from 'modules/hero/components/heroes/heroes.component';
import { DashboardComponent } from 'modules/hero/components/dashboard/dashboard.component';
import { HeroDetailComponent } from 'modules/hero/components/hero-detail/hero-detail.component';

import { logRoutes } from './modules/log/log.routes';

const routes: Routes = [
  { path: 'heroes', component: HeroesComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  ...logRoutes,
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
