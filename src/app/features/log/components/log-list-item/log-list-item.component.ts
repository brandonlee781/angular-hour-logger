import { Component, Input, OnInit } from '@angular/core';
import { format, parse } from 'date-fns';
import Log from 'features/log/Log';

@Component({
  selector: 'bl-log-list-item',
  templateUrl: './log-list-item.component.html',
  styleUrls: ['./log-list-item.component.scss'],
})
export class LogListItemComponent implements OnInit {
  @Input() log: Log;

  constructor() {}

  ngOnInit() {}

  formatTime(time) {
    const today = format(new Date(), 'YYYY-MM-DD');
    const parsed = parse(`${today}T${time}`);
    return format(parsed, 'h:mm a');
  }
}
