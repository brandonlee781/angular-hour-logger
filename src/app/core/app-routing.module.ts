import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { logRoutes } from 'modules/log/log.routes';

const routes: Routes = [
  ...logRoutes,
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
