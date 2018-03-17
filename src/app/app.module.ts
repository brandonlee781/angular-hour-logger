import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { UIModule } from 'modules/ui/ui.module';

import { AppRoutingModule } from 'core/app-routing.module';
import { GraphqlModule } from 'core/graphql.module';
import { MaterialModule } from 'core/material.module';

import { AppComponent } from './app.component';
import { LogModule } from 'modules/log/log.module';
import { SharedModule } from 'shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,

    SharedModule,
    LogModule,
    UIModule,

    AppRoutingModule,
    GraphqlModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
