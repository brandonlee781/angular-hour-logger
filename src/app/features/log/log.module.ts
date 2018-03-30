import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconRegistry } from '@angular/material';
import { Apollo } from 'apollo-angular';
import { GraphqlModule } from 'core/graphql.module';
import { MaterialModule } from 'core/material.module';
import { SharedModule } from 'shared/shared.module';

import { LogListItemComponent } from './components/log-list-item/log-list-item.component';
import { LogListComponent } from './components/log-list/log-list.component';
import { NewLogDialogComponent } from './components/new-log-dialog/new-log-dialog.component';
import { LogRoutingModule } from './log-routing.module';
import { LogPage } from './pages/log/log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    LogRoutingModule,
    GraphqlModule,
  ],
  declarations: [
    LogListComponent,
    LogPage,
    LogListItemComponent,
    NewLogDialogComponent,
  ],
  providers: [Apollo, MatIconRegistry],
  entryComponents: [NewLogDialogComponent],
})
export class LogModule {}