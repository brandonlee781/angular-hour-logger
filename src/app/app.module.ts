import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from 'core/app-routing.module';
import { GraphqlModule } from 'core/graphql.module';
import { MaterialModule } from 'core/material.module';
import { UIModule } from 'features/ui/ui.module';
import { NavDrawerService } from 'shared/services/nav-drawer.service';
import { UserService } from 'shared/services/user.service';
import { SharedModule } from 'shared/shared.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './features/login/login.component';

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    GraphqlModule,
    MaterialModule,
    ReactiveFormsModule,
    UIModule,
  ],
  exports: [UIModule],
  providers: [UserService, NavDrawerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
