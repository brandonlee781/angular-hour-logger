// tslint:disable:component-class-suffix
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/map';

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Apollo } from 'apollo-angular';
import { format } from 'date-fns';
import { NewLogDialogComponent } from 'features/log/components/new-log-dialog/new-log-dialog.component';
import Log from 'features/log/Log';
import Project from 'features/project/Project';
import { Observable } from 'rxjs/Observable';
import { GET_PROJECT_NAMES, LOG_LIST_QUERY } from 'shared/graphql/queries';

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

  openDialog(): void {
    const dialogRef = this.dialog.open(NewLogDialogComponent, {
      width: '500px',
      data: { name: this.name, animal: this.animal },
      position: {
        top: '16px',
        right: '16px',
      },
    });

    dialogRef.afterClosed().subscribe((result: Log) => {
      if (result) {
        const self = this;
        const newLog = result;
        let projectName;
        self.projects$
          .map(projects => projects.find(p => p.id === newLog.project.id))
          .subscribe(proj => (projectName = proj.name));

        // this.apollo.mutate({
        //     mutation: NEW_LOG,
        //     variables: {
        //       startTime: format(newLog.startTime, 'H:mm:ss'),
        //       endTime: format(newLog.endTime, 'H:mm:ss'),
        //       date: format(newLog.date, 'YYYY-MM-DD'),
        //       duration,
        //       project: newLog.project,
        //       note: newLog.note,
        //     },
        //     optimisticResponse: {
        //       __typename: 'Mutation',
        //       createLog: {
        //         __typename: 'createLog',
        //         log: {
        //           __typename: 'Log',
        //           id: 'tempid',
        //           startTime: format(newLog.startTime, 'H:mm:ss'),
        //           endTime: format(newLog.endTime, 'H:mm:ss'),
        //           date: format(newLog.date, 'YYYY-MM-DD'),
        //           duration,
        //           project: {
        //             __typename: 'Project',
        //             id: newLog.project,
        //             name: projectName,
        //             color: '',
        //           },
        //           note: newLog.note,
        //         },
        //       },
        //     },
        //     update: (proxy, { data: { createLog } }) => {
        //       const data: LogListQuery = proxy.readQuery({
        //         query: LOG_LIST_QUERY,
        //         variables: {
        //           project: null,
        //         },
        //       });
        //       data.allLogsByProjectId.logs.unshift(createLog.log);
        //       proxy.writeQuery({ query: LOG_LIST_QUERY, data });
        //     },
        //   }).subscribe();
        // }
      }
    });
  }
}
