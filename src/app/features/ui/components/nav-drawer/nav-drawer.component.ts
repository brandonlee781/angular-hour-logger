import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavDrawerService } from 'shared/services/nav-drawer.service';

@Component({
  selector: 'bl-nav-drawer',
  templateUrl: './nav-drawer.component.html',
  styleUrls: ['./nav-drawer.component.scss'],
})
export class NavDrawerComponent implements OnInit {
  @Input() links;
  @Input() loading: boolean;
  @Input() headerTitle: string;
  @Input() headerIcon: string;
  @Output() headerAction: EventEmitter<any> = new EventEmitter();
  @Output() selected: EventEmitter<any> = new EventEmitter();
  isDesktop: boolean;
  isOpened: boolean;

  constructor(
    public breakpointObserver: BreakpointObserver,
    private navDrawerService: NavDrawerService,
  ) {
    navDrawerService.isNavDrawerOpen$.subscribe(isOpened => {
      this.isOpened = isOpened;
    });
  }

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Large, Breakpoints.XLarge])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isDesktop = true;
          this.isOpened = true;
        } else {
          this.isDesktop = false;
          this.isOpened = false;
        }
        this.navDrawerService.setValue(this.isDesktop);
      });
  }

  toggleDrawer() {
    this.navDrawerService.setValue(!this.isOpened);
  }

  changeSelected(link) {
    this.selected.emit(link);
    if (!this.isDesktop) {
      this.toggleDrawer();
    }
  }

  headerButtonClicked() {
    this.headerAction.emit();
  }
}
