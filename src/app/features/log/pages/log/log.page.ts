// tslint:disable:component-class-suffix
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/map';

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
  innerWidth: number;
  headerTitle: string;
  selectedProject: string;

  name = 'brandon';
  animal = 'dog';

  constructor(private apollo: Apollo, public dialog: MatDialog) {}

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

  /**
   * Method controls the opening of the New Log Dialog and sets
   * an event on close. If a valid log is passed back when dialog
   * closes perform a mutation on the log list
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(NewLogDialogComponent, {
      width: '500px',
      data: { header: 'New Log Entry' },
      position: {
        top: '16px',
        right: '16px',
      },
    });

    dialogRef.afterClosed().subscribe((result: Log) => {
      if (result) {
        const self = this;
        const { startTime, endTime, date, duration, project, note } = result;

        this.apollo
          .mutate({
            mutation: NEW_LOG,
            variables: {
              startTime: format(startTime, 'H:mm:ss'),
              endTime: format(endTime, 'H:mm:ss'),
              date: format(date, 'YYYY-MM-DD'),
              duration,
              project: project.id,
              note,
            },
            optimisticResponse: {
              __typename: 'Mutation',
              createLog: {
                __typename: 'createLog',
                log: {
                  __typename: 'Log',
                  id: 'tempid',
                  startTime: format(startTime, 'H:mm:ss'),
                  endTime: format(endTime, 'H:mm:ss'),
                  date: format(date, 'YYYY-MM-DD'),
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

    editLogDialog.afterClosed().subscribe((result: Log) => {
      if (result) {
        const self = this;
        const { id, startTime, endTime, date, project, note } = result;
        const duration = differenceInMinutes(endTime, startTime) / 60;

        this.apollo
          .mutate({
            mutation: UPDATE_LOG,
            variables: {
              id,
              startTime: format(startTime, 'H:mm:ss'),
              endTime: format(endTime, 'H:mm:ss'),
              date: format(date, 'YYYY-MM-DD'),
              duration,
              project: project.id,
              note,
            },
            optimisticResponse: {
              __typename: 'Mutation',
              updateLog: {
                __typename: 'updateLog',
                log: {
                  __typename: 'Log',
                  id,
                  startTime: format(startTime, 'H:mm:ss'),
                  endTime: format(endTime, 'H:mm:ss'),
                  date: format(date, 'YYYY-MM-DD'),
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
