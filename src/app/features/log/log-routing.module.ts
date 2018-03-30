import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogPage } from 'features/log/pages/log/log.page';

const routes: Routes = [
  {
    path: '',
    component: LogPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogRoutingModule {}