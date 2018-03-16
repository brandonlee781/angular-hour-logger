import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { UIModule } from 'modules/ui/ui.module';
import { HeroModule } from 'modules/hero/hero.module';

import { AppRoutingModule } from './app-routing.module';
import { GraphqlModule } from './graphql.module';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { MessagesComponent } from './shared/components/messages/messages.component';

import { MessageService } from './shared/services/message.service';
import { LogModule } from './modules/log/log.module';
import { SharedModule } from 'shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    MessagesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,

    HeroModule,
    SharedModule,
    LogModule,
    UIModule,

    AppRoutingModule,
    GraphqlModule,
    MaterialModule,
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule {}
