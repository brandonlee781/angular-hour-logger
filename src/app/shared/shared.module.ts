import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'core/material.module';
import { NavDrawerItemComponent } from 'shared/components/nav-drawer-item/nav-drawer-item.component';

import { NavDrawerComponent } from './components/nav-drawer/nav-drawer.component';

@NgModule({
  imports: [CommonModule, MaterialModule, LayoutModule],
  declarations: [NavDrawerComponent, NavDrawerItemComponent],
  exports: [NavDrawerComponent, NavDrawerItemComponent],
})
export class SharedModule {}
