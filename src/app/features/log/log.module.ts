import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatIconRegistry,
  MatSnackBar,
  MatSnackBarContainer,
} from '@angular/material';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { CalendarModule } from 'angular-calendar';
import { Apollo } from 'apollo-angular';
import { GraphqlModule } from 'core/graphql.module';
import { MaterialModule } from 'core/material.module';
import { LogsPage } from 'features/log/pages/logs/logs.page';
import { RecentLogsPage } from 'features/log/pages/recentLogs/recentLogs.page';
import { LogViewService } from 'features/log/services/log-view.service';
import { UIModule } from 'features/ui/ui.module';

import { LogCalendarComponent } from './components/log-calendar/log-calendar.component';
import { LogListItemComponent } from './components/log-list-item/log-list-item.component';
import { LogListComponent } from './components/log-list/log-list.component';
import { NewLogDialogComponent } from './components/new-log-dialog/new-log-dialog.component';
import { LogRoutingModule } from './log-routing.module';
import { LogPage } from './pages/log/log.page';

@NgModule({
  imports: [
    CalendarModule.forRoot(),
    CommonModule,
    EcoFabSpeedDialModule,
    FormsModule,
    ReactiveFormsModule,
    LogRoutingModule,
    MaterialModule,
    GraphqlModule,
    UIModule,
  ],
  declarations: [
    LogCalendarComponent,
    LogListComponent,
    LogListItemComponent,
    LogPage,
    LogsPage,
    NewLogDialogComponent,
    RecentLogsPage,
  ],
  providers: [Apollo, MatIconRegistry, MatSnackBar, LogViewService],
  entryComponents: [NewLogDialogComponent, MatSnackBarContainer],
})
export class LogModule {}
