import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from 'core/app-routing.module';
import { GraphqlModule } from 'core/graphql.module';
import { UIModule } from 'modules/ui/ui.module';
import { SharedModule } from 'shared/shared.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    SharedModule,
    // LogModule,
    // ProjectModule,
    UIModule,

    AppRoutingModule,
    GraphqlModule,
    // MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
