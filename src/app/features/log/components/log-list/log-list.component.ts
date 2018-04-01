import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import Log from 'features/log/Log';
import { LOG_LIST_QUERY, LogListQuery } from 'shared/graphql/queries';

@Component({
  selector: 'bl-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss'],
})
export class LogListComponent implements OnInit, OnChanges {
  @Input() selectedProject: string;
  @Output() editLog = new EventEmitter<Log>();
  logQuery: QueryRef<any>;
  logs: Log[];

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.getLogs(this.selectedProject);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.selectedProject.firstChange) {
      this.getLogs(this.selectedProject);
    }
  }

  getLogs(project) {
    this.logQuery = this.apollo.watchQuery<LogListQuery>({
      query: LOG_LIST_QUERY,
      variables: {
        project: project !== 'recent' ? project : null,
      },
    });
    this.logQuery.valueChanges.subscribe(q => {
      this.logs = q.data.allLogsByProjectId.logs;
    });
  }

  loadMore() {
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
}
