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
import { LOG_LIST_QUERY, LogListQuery } from '../../schema/queries';

@Component({
  selector: 'bl-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.scss'],
})
export class LogListComponent implements OnInit, OnChanges {
  @Input() logs: Log[];
  @Input() selectedProject: string = null;
  @Input() loading = false;
  @Output() editLog = new EventEmitter<Log>();
  @Output() newLog = new EventEmitter<any>();
  @Output() loadMore = new EventEmitter<any>();
  showEmptyState = false;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.loading && (!this.logs || !this.logs.length)) {
      this.showEmptyState = true;
    } else {
      this.showEmptyState = false;
    }
  }
}
