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
import { differenceInMinutes, format } from 'date-fns';
import { NewLogDialogComponent } from 'features/log/components/new-log-dialog/new-log-dialog.component';
import Log from 'features/log/Log';
import Project from 'features/project/Project';
import { Observable } from 'rxjs/Observable';
import { NEW_LOG, UPDATE_LOG } from 'shared/graphql/mutations';
import {
  GET_PROJECT_NAMES,
  LOG_LIST_QUERY,
  LogListQuery,
} from 'shared/graphql/queries';
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
  isSelected: boolean;
}

@Component({
  selector: 'bl-log',
  templateUrl: './log.page.html',
  styleUrls: ['./log.page.scss'],
})
export class LogPage implements OnInit {
  links$: Observable<Link[]>;
  projects$: Observable<Project[]>;
  headerTitle: string;
  selectedProject: string;
  currentView = 'list';
  isDesktop: boolean;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver,
    private navDrawerService: NavDrawerService,
  ) {}

  ngOnInit() {
    this.headerTitle = 'Recent Log Entries';
    this.selectedProject = 'recent';
    const defaultLink = [
      {
        name: 'Recent Log Entries',
        id: 'recent',
      },
    ];
    this.links$ = this.apollo
      .watchQuery<ProjectQuery>({ query: GET_PROJECT_NAMES })
      .valueChanges.map(p => defaultLink.concat(p.data.allProjects.projects))
      .map((arr: Project[]) =>
        arr.map((proj: Project) => ({
          icon: proj.id === 'recent' ? '' : 'folder_open',
          isSelected: proj.id === 'recent' ? true : false,
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

  onLinkSelected(link) {
    this.headerTitle = link.text;
    this.selectedProject = link.id;

    this.links$ = this.links$.map(links => {
      return links.map(l => {
        return Object.assign({}, l, {
          isSelected: l.id === link.id ? true : false,
        });
      });
    });
  }

  onToggleCalendar(event) {
    if (this.currentView === 'list') {
      this.currentView = 'calendar';
    } else {
      this.currentView = 'list';
    }
    if (!this.isDesktop) {
      this.navDrawerService.setValue(false);
    }
  }

  /**
   * Method controls the opening of the New Log Dialog and sets
   * an event on close. If a valid log is passed back when dialog
   * closes perform a mutation on the log list
   */
  openDialog(): void {
    const createLogDialog = this.dialog.open(NewLogDialogComponent, {
      width: '500px',
      data: { header: 'New Log Entry' },
      position: {
        top: '16px',
        right: '16px',
      },
    });

    createLogDialog.afterClosed().subscribe(result => {
      if (result) {
        const self = this;
        const { startTime, endTime, date, duration, project, note } = result;
        const formatDate = format(date, 'YYYY-MM-DD');
        const formatStart = format(startTime, 'HH:mm:ss');
        const formatEnd = format(endTime, 'HH:mm:ss');
        const start = format(
          `${formatDate} ${formatStart}`,
          'YYYY-MM-DD H:mm:ss',
        );
        const end = format(`${formatDate} ${formatEnd}`, 'YYYY-MM-DD H:mm:ss');

        this.apollo
          .mutate({
            mutation: NEW_LOG,
            variables: {
              start,
              end,
              duration,
              note,
              project: project.id,
            },
            optimisticResponse: {
              __typename: 'Mutation',
              createLog: {
                __typename: 'createLog',
                log: {
                  __typename: 'Log',
                  id: 'tempid',
                  start,
                  end,
                  duration,
                  project: {
                    __typename: 'Project',
                    id: project.id,
                    name: project.name,
                    color: '',
                  },
                  note,
                },
              },
            },
            update: (proxy, { data: { createLog } }) => {
              const listQuery = {
                query: LOG_LIST_QUERY,
                variables: {
                  project:
                    this.selectedProject !== 'recent'
                      ? this.selectedProject
                      : null,
                },
              };
              const data: LogListQuery = proxy.readQuery(listQuery);
              data.allLogsByProjectId.logs.unshift(createLog.log);
              proxy.writeQuery({ ...listQuery, data });
            },
          })
          .subscribe();
      }
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

    editLogDialog.afterClosed().subscribe(result => {
      if (result) {
        const self = this;
        const { id, startTime, endTime, date, project, note } = result;
        const duration = differenceInMinutes(endTime, startTime) / 60;
        const formatDate = format(date, 'YYYY-MM-DD');
        const formatStart = format(startTime, 'HH:mm:ss');
        const formatEnd = format(endTime, 'HH:mm:ss');
        const start = format(
          `${formatDate} ${formatStart}`,
          'YYYY-MM-DD H:mm:ss',
        );
        const end = format(`${formatDate} ${formatEnd}`, 'YYYY-MM-DD H:mm:ss');

        this.apollo
          .mutate({
            mutation: UPDATE_LOG,
            variables: {
              id,
              start,
              end,
              duration,
              note,
              project: project.id,
            },
            optimisticResponse: {
              __typename: 'Mutation',
              updateLog: {
                __typename: 'updateLog',
                log: {
                  __typename: 'Log',
                  id,
                  start,
                  end,
                  duration,
                  project: {
                    __typename: 'Project',
                    id: project.id,
                    name: project.name,
                    color: '',
                  },
                  note,
                },
              },
            },
            update: (proxy, { data: { updateLog } }) => {
              const listQuery = {
                query: LOG_LIST_QUERY,
                variables: {
                  project:
                    this.selectedProject !== 'recent'
                      ? this.selectedProject
                      : null,
                },
              };
              const data: LogListQuery = proxy.readQuery(listQuery);
              const index = data.allLogsByProjectId.logs
                .map(l => l.id)
                .indexOf(updateLog.log.id);
              const logs = data.allLogsByProjectId.logs;

              data.allLogsByProjectId.logs = [
                ...logs.slice(0, index),
                updateLog.log,
                ...logs.slice(index + 1),
              ];

              proxy.writeQuery({ ...listQuery, data });
            },
          })
          .subscribe();
      }
    });
  }
}
