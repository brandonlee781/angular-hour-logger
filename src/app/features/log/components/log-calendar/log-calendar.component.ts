import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Apollo } from 'apollo-angular';
import { format, isSameDay, isSameMonth, parse } from 'date-fns';
import Log from 'features/log/Log';
import { Subject } from 'rxjs/Subject';
import { LOG_LIST_QUERY, LogListQuery } from 'shared/graphql/queries';

@Component({
  selector: 'bl-log-calendar',
  templateUrl: './log-calendar.component.html',
  styleUrls: ['./log-calendar.component.scss'],
})
export class LogCalendarComponent implements OnInit {
  logs: Log[];
  events: CalendarEvent[];
  view = 'month';
  viewDate = new Date('2018-03-30');
  refresh = new Subject<any>();
  activeDayIsOpen = false;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.getLogs();
  }

  getLogs() {
    this.apollo
      .watchQuery<LogListQuery>({
        query: LOG_LIST_QUERY,
        variables: {
          project: null,
          options: {
            limit: 1000,
          },
        },
      })
      .valueChanges.subscribe(response => {
        const logs: Log[] = response.data.allLogsByProjectId.logs;
        this.logs = logs;
        this.events = logs.map(log => ({
          start: parse(log.date + ' ' + log.startTime),
          end: parse(log.date + ' ' + log.startTime),
          title: `
          ${log.project.name}
          ${format(log.date + ' ' + log.startTime, 'h:mm a')} - ${format(
            log.date + ' ' + log.endTime,
            'h:mm a',
          )}
        `,
          color: {
            primary: log.project.color,
            secondary: log.project.color,
          },
        }));
        this.refresh.next();
      });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }
}
