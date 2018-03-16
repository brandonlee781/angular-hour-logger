import { Component, OnInit, Input, OnChanges } from '@angular/core';
import Log from 'modules/log/Log';
import { LOG_LIST_QUERY } from 'shared/queries';
import { Apollo, QueryRef } from 'apollo-angular';
import { Observable } from 'apollo-link';

interface LogListQuery {
  allLogsByProjectId: {
    logs: Log[]
  };
}

@Component({
  selector: 'bl-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss']
})
export class LogListComponent implements OnInit, OnChanges {
  @Input() selectedProject: string;
  logQuery: QueryRef<any>;
  logs: Log[];

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.getLogs(this.selectedProject);
  }

  ngOnChanges() {
    this.getLogs(this.selectedProject);
  }

  getLogs(project) {
    this.logQuery = this.apollo
      .watchQuery<LogListQuery>({
        query: LOG_LIST_QUERY,
        variables: {
          project: project !== 'recent' ? project : null,
        }
      });
    this.logQuery
      .valueChanges
      .subscribe(q => {
        this.logs = q.data.allLogsByProjectId.logs;
      });
  }

  loadMore() {
    this.logQuery.fetchMore({
      variables: {
        offset: this.logs.length
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult)  { return prev; }

        return {
          allLogsByProjectId: {
            __typename: prev.allLogsByProjectId.__typename,
            logs: [
              ...prev.allLogsByProjectId.logs,
              ...fetchMoreResult.allLogsByProjectId.logs,
            ]
          }
        };
      }
    });
  }

}
