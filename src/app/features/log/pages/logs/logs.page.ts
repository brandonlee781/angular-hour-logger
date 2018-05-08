// tslint:disable:component-class-suffix
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/map';

import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Apollo } from 'apollo-angular';
import { LogViewService } from 'features/log/services/log-view.service';
import Project from 'features/project/Project';
import { GET_PROJECT_NAMES } from 'features/project/schema/queries';
import { Observable } from 'rxjs/Observable';
import { NavDrawerService } from 'shared/services/nav-drawer.service';

interface ProjectQuery {
  allProjects: {
    projects: Project[];
  };
}

interface Link {
  icon: string;
  text: string;
  id: string;
  path: string;
}

@Component({
  selector: 'bl-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage implements OnInit {
  links$: Observable<Link[]>;
  projects$: Observable<Project[]>;
  currentView;
  isDesktop: boolean;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver,
    private navDrawerService: NavDrawerService,
    private logViewService: LogViewService,
  ) {}

  ngOnInit() {
    this.logViewService.view$.subscribe(v => {
      this.currentView = v;
    });
    this.links$ = this.apollo
      .watchQuery<ProjectQuery>({ query: GET_PROJECT_NAMES })
      .valueChanges.map(p => p.data.allProjects.projects)
      .map((arr: Project[]) =>
        arr.map((proj: Project) => ({
          icon: proj.id === '' ? '' : 'folder_open',
          path: '/logs',
          route: proj.name,
          text: proj.name,
          id: proj.id,
        })),
      );
    this.breakpointObserver
      .observe([Breakpoints.Large, Breakpoints.XLarge])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isDesktop = true;
        } else {
          this.isDesktop = false;
        }
      });
  }

  onToggleCalendar() {
    this.logViewService.toggleView();
  }
}
