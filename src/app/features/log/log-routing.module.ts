import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogPage } from 'features/log/pages/log/log.page';
import { LogsPage } from 'features/log/pages/logs/logs.page';
import { RecentLogsPage } from 'features/log/pages/recentLogs/recentLogs.page';

const routes: Routes = [
  {
    path: '',
    component: LogsPage,
    children: [
      {
        path: '',
        component: RecentLogsPage,
      },
      {
        path: ':project',
        component: LogPage,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogRoutingModule {}
