import { map } from 'rxjs/operators';
// tslint:disable:component-class-suffix

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Apollo, QueryRef } from 'apollo-angular';
import { differenceInMinutes, format } from 'date-fns';
import { NewLogDialogComponent } from 'features/log/components/new-log-dialog/new-log-dialog.component';
import Log from 'features/log/Log';
import { LogViewService } from 'features/log/services/log-view.service';
import Project from 'features/project/Project';
import {
  GET_PROJECT_NAMES,
  GetProjectNameQuery,
} from 'features/project/schema/queries';

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
  isSelected: boolean;
}

@Component({
  selector: 'bl-log',
  templateUrl: './log.page.html',
  styleUrls: ['./log.page.scss'],
})
export class LogPage implements OnInit {
  logs: Log[];
  project: Project;
  logQuery: QueryRef<any>;
  isDesktop: boolean;
  open = false;
  currentView;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private logViewService: LogViewService,
  ) {
    this.route.params.subscribe(params => {
      this.apollo
        .watchQuery<GetProjectNameQuery>({ query: GET_PROJECT_NAMES })
        .valueChanges.pipe(map(p => p.data.allProjects.projects))
        .subscribe((projects: Project[]) => {
          this.project = projects.find(
            proj => proj.name === params.project || proj.name === '',
          );
          this.getLogs(this.project.id);
        });
    });
  }

  ngOnInit() {
    this.logViewService.view$.subscribe(v => {
      this.currentView = v;
    });
  }

  getLogs(id) {
    this.logQuery = this.apollo.watchQuery<LogListQuery>({
      query: LOG_LIST_QUERY,
      variables: {
        project: id,
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

  /**
   * Method controls the opening of the New Log Dialog and sets
   * an event on close. If a valid log is passed back when dialog
   * closes perform a mutation on the log list
   */
  openDialog(projectId): void {
    const createLogDialog = this.dialog.open(NewLogDialogComponent, {
      panelClass: 'new-log-dialog',
      data: { header: 'New Log Entry', projectId },
    });
  }

  editLog(log: Log): void {
    const editLogDialog = this.dialog.open(NewLogDialogComponent, {
      panelClass: 'new-log-dialog',
      data: { header: 'Edit Log Entry', ...log },
    });
  }
}
