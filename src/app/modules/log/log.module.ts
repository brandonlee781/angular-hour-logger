import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogListComponent } from './components/log-list/log-list.component';
import { LogPage } from './pages/log/log.page';
import { SharedModule } from 'shared/shared.module';
import { MaterialModule } from 'core/material.module';
import { LogListItemComponent } from './components/log-list-item/log-list-item.component';
import { Apollo } from 'apollo-angular';
import { MatIconRegistry } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
  ],
  declarations: [LogListComponent, LogPage, LogListItemComponent],
  exports: [LogListComponent, LogPage, LogListItemComponent],
  providers: [ Apollo, MatIconRegistry ]
})
export class LogModule { }
