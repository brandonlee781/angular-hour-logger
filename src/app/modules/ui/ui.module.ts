import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'core/material.module';

import { MenuToggleButtonComponent } from './components/menu-toggle-button/menu-toggle-button.component';
import { SideNavBtnComponent } from './components/side-nav-btn/side-nav-btn.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';

@NgModule({
  imports: [MaterialModule, RouterModule],
  declarations: [
    SideNavComponent,
    SideNavBtnComponent,
    MenuToggleButtonComponent,
  ],
  exports: [SideNavComponent, SideNavBtnComponent, MenuToggleButtonComponent],
  // providers: [ MatIconRegistry ]
})
export class UIModule {}
