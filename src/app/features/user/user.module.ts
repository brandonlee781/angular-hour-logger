import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GraphqlModule } from 'core/graphql.module';
import { MaterialModule } from 'core/material.module';
import { UIModule } from 'features/ui/ui.module';
import { UserRoutingModule } from 'features/user/user-routing.module';

import { ProfilePage } from './pages/profile/profile.page';

@NgModule({
  imports: [
    CommonModule,
    GraphqlModule,
    MaterialModule,
    UIModule,
    UserRoutingModule,
  ],
  declarations: [ProfilePage],
})
export class UserModule {}
