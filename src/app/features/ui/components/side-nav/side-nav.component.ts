import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { NavDrawerService } from 'shared/services/nav-drawer.service';

@Component({
  selector: 'bl-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  @Input() user;
  isDesktop: boolean;
  isNavDrawerOpen: boolean;

  constructor(
    public breakpointObserver: BreakpointObserver,
    private navDrawerService: NavDrawerService,
  ) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Large])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isDesktop = true;
          this.navDrawerService.setValue(true);
        } else {
          this.isDesktop = false;
          this.navDrawerService.setValue(false);
        }
      });
    this.navDrawerService.isNavDrawerOpen$.subscribe(isOpened => {
      this.isNavDrawerOpen = isOpened;
    });
  }

  toggleMenu() {
    this.navDrawerService.setValue(!this.isNavDrawerOpen);
  }
}
