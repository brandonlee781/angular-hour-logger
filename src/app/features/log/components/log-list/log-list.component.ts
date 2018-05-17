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
export class LogListComponent implements OnInit {
  @Input() logs: Log[];
  @Input() selectedProject: string = null;
  @Output() editLog = new EventEmitter<Log>();
  @Output() newLog = new EventEmitter<any>();
  @Output() loadMore = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}
}
