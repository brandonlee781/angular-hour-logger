import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { format, isAfter, isBefore, parse } from 'date-fns';
import Invoice from 'features/invoice/Invoice';
import Log from 'features/log/Log';

export interface ProjectPieChart {
  name: string;
  value: number;
}

export interface ProjectPieChartMulti {
  name: string;
  series: ProjectPieChart[];
}

@Component({
  selector: 'bl-invoice-stats',
  templateUrl: './invoice-stats.component.html',
  styleUrls: ['./invoice-stats.component.scss'],
})
export class InvoiceStatsComponent implements OnInit, OnChanges {
  @Input() invoice: Invoice;
  projectHours: ProjectPieChart[] = [];
  projectPay: ProjectPieChart[] = [];
  dateHours: ProjectPieChartMulti[] = [];
  view: any[] = [700, 225];
  gradient = true;
  colorScheme = {
    domain: [],
  };

  constructor() {}

  ngOnInit() {
    const windowHeight = window.innerHeight;
    const chartWidth = document.querySelector('.invoice-content').clientWidth;
    const chartHeight = (windowHeight - 260) / 3;
    this.view = [chartWidth, chartHeight];
    if (this.invoice) {
      this.projectHours = this.hoursPerProject(this.invoice.logs);
      this.projectPay = this.payPerProject(this.invoice.logs);
      this.dateHours = this.hoursPerDay(this.invoice.logs);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const content = document.querySelector('.invoice-content');
    if (!changes.invoice.firstChange) {
      this.projectHours = this.hoursPerProject(this.invoice.logs);
      this.projectPay = this.payPerProject(this.invoice.logs);
      this.dateHours = this.hoursPerDay(this.invoice.logs);
    }
  }

  hoursPerProject(logs: Log[]): ProjectPieChart[] {
    const array: ProjectPieChart[] = [];
    const sorted = this.sortByProject(logs);
    Object.keys(sorted).map(key => {
      this.colorScheme.domain.push(sorted[key][0].project.color);
      array.push({
        name: key,
        value: sorted[key].reduce((a: number, b: Log) => a + b.duration, 0),
      });
    });
    return array;
  }

  payPerProject(logs: Log[]): ProjectPieChart[] {
    const array: ProjectPieChart[] = [];
    const sorted = this.sortByProject(logs);
    Object.keys(sorted).map(key => {
      const total = sorted[key].reduce(
        (a: number, b: Log) => a + b.duration,
        0,
      );
      array.push({
        name: key,
        value: this.invoice.rate * total,
      });
    });
    return array;
  }

  hoursPerDay(logs: Log[]): ProjectPieChartMulti[] {
    const arr: ProjectPieChartMulti[] = [];
    const sortedDates = new Set(
      logs
        .slice()
        .sort((a, b) => {
          const aDate = parse(a.start);
          const bDate = parse(b.start);
          if (isBefore(aDate, bDate)) {
            return -1;
          } else if (isAfter(aDate, bDate)) {
            return 1;
          }
          return 0;
        })
        .map(l => format(l.start, 'YYYY-MM-DD')),
    );
    const projects = this.hoursPerProject(logs).map(p => ({
      name: p.name,
      series: [],
    }));

    return projects.map(project => {
      return {
        name: project.name,
        series: Array.from(sortedDates).map(date => {
          const dateLogs = logs.filter(l => {
            return (
              l.project.name === project.name &&
              format(l.start, 'YYYY-MM-DD') === date
            );
          });
          return {
            name: date,
            value: dateLogs.length
              ? dateLogs.map(l => l.duration).reduce((a, b) => a + b, 0)
              : 0,
          };
        }),
      };
    });
  }

  sortByProject(logs: Log[]) {
    const sorted = {};
    logs.forEach(log => {
      if (sorted[log.project.name]) {
        sorted[log.project.name].push(log);
      } else {
        sorted[log.project.name] = [log];
      }
    });
    return sorted;
  }

  onSelect(event) {
    console.log(event);
  }

  onResize(event) {
    const windowHeight = window.innerHeight;
    const chartWidth = document.querySelector('.invoice-content').clientWidth;
    const chartHeight = (windowHeight - 260) / 3;
    this.view = [chartWidth - 16, chartHeight];
  }

  dateHoursXFormat(label) {
    const date = parse(label);
    return format(date, 'ddd, Do [of] MMM');
  }
}
