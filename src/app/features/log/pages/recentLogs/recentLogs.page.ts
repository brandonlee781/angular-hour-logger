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
import { Apollo, QueryRef } from 'apollo-angular';
import { differenceInMinutes, format } from 'date-fns';
import { NewLogDialogComponent } from 'features/log/components/new-log-dialog/new-log-dialog.component';
import Log from 'features/log/Log';
import { LogViewService } from 'features/log/services/log-view.service';
import Project from 'features/project/Project';
import { NavDrawerService } from 'shared/services/nav-drawer.service';

import { NEW_LOG, UPDATE_LOG } from '../../schema/mutations';
import { LOG_LIST_QUERY, LogListQuery } from '../../schema/queries';

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
  selector: 'bl-recent-logs',
  templateUrl: './recentLogs.page.html',
  styleUrls: ['./recentLogs.page.scss'],
})
export class RecentLogsPage implements OnInit {
  logQuery: QueryRef<any>;
  logs: Log[];
  currentView;
  isDesktop: boolean;
  open = false;

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
    this.getLogs();
  }

  getLogs() {
    this.logQuery = this.apollo.watchQuery<LogListQuery>({
      query: LOG_LIST_QUERY,
      variables: {
        project: null,
      },
    });
    this.logQuery.valueChanges.subscribe(q => {
      this.logs = q.data.allLogsByProjectId.logs;
    });
  }

  loadMoreLogs() {
    this.logQuery.fetchMore({
      variables: {
        offset: this.logs.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        return {
          allLogsByProjectId: {
            __typename: prev.allLogsByProjectId.__typename,
            logs: [
              ...prev.allLogsByProjectId.logs,
              ...fetchMoreResult.allLogsByProjectId.logs,
            ],
          },
        };
      },
    });
  }

  openDialog(projectId): void {
    const createLogDialog = this.dialog.open(NewLogDialogComponent, {
      width: '500px',
      data: { header: 'New Log Entry' },
      position: {
        top: '16px',
        right: '16px',
      },
    });
  }

  editLog(log: Log): void {
    const editLogDialog = this.dialog.open(NewLogDialogComponent, {
      width: '500px',
      data: { header: 'Edit Log Entry', ...log },
      position: {
        top: '16px',
        right: '16px',
      },
    });
  }
}
