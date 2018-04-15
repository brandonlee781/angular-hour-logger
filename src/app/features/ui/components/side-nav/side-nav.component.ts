import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
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
    private router: Router,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    iconRegistry.addSvgIcon(
      'hamburger',
      sanitizer.bypassSecurityTrustResourceUrl('assets/cheese-burger.svg'),
    );
  }

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Large, Breakpoints.XLarge])
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
