import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { format, parse } from 'date-fns';
import Log from 'features/log/Log';
import { DELETE_LOG } from 'shared/graphql/mutations';
import { LOG_LIST_QUERY, LogListQuery } from 'shared/graphql/queries';

@Component({
  selector: 'bl-log-list-item',
  templateUrl: './log-list-item.component.html',
  styleUrls: ['./log-list-item.component.scss'],
})
export class LogListItemComponent implements OnInit {
  @Input() log: Log;
  @Input() selectedProject: string;
  @Output() editLog = new EventEmitter<Log>();

  constructor(private apollo: Apollo) {}

  ngOnInit() {}

  formatTime(time) {
    const today = format(new Date(), 'YYYY-MM-DD');
    const parsed = parse(`${today}T${time}`);
    return format(parsed, 'h:mm a');
  }

  deleteLog(log: string) {
    if (window.confirm('Are you sure you want to delete this log entry?')) {
      this.apollo
        .mutate({
          mutation: DELETE_LOG,
          variables: {
            logId: log,
          },
          update: (proxy, { data: { deleteLog } }) => {
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
            const filtered = data.allLogsByProjectId.logs.filter(
              l => l.id !== log,
            );
            data.allLogsByProjectId.logs = filtered;
            proxy.writeQuery({ ...listQuery, data });
          },
        })
        .subscribe();
    }
  }

  onEditClick() {
    const log = this.log;
    this.editLog.emit(log);
  }
}
