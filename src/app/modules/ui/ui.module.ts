import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SideNavComponent } from './components/side-nav/side-nav.component';
import { SideNavBtnComponent } from './components/side-nav-btn/side-nav-btn.component';
import { MaterialModule } from '../../material.module';

@NgModule({
  imports: [
    MaterialModule,
    RouterModule,
  ],
  declarations: [SideNavComponent, SideNavBtnComponent],
  exports: [ SideNavComponent, SideNavBtnComponent ],
})
export class UIModule { }
