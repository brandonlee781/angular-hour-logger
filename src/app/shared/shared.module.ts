import { NgModule } from '@angular/core';
import { NavDrawerComponent } from './components/nav-drawer/nav-drawer.component';
import { NavDrawerItemComponent } from 'shared/components/nav-drawer-item/nav-drawer-item.component';
import { MaterialModule } from '../material.module';


@NgModule({
  imports: [
    MaterialModule,
  ],
  declarations: [
    NavDrawerComponent,
    NavDrawerItemComponent
  ],
  exports: [
    NavDrawerComponent,
    NavDrawerItemComponent,
  ]
})
export class SharedModule { }
