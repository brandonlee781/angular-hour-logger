import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import Invoice from 'features/invoice/Invoice';
import Log from 'features/log/Log';
import { User } from 'features/User';
import { UserService } from 'shared/services/user.service';

export interface ProjectHours {
  project: string;
  hours: number;
}

@Component({
  selector: 'bl-invoice-document',
  templateUrl: './invoice-document.component.html',
  styleUrls: ['./invoice-document.component.scss'],
})
export class InvoiceDocumentComponent implements OnInit, OnChanges {
  @Input() invoice: Invoice;
  projectHours: ProjectHours[];
  user: User;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.user.subscribe(user => (this.user = user));
    if (this.invoice) {
      this.projectHours = this.hoursPerProject(this.invoice.logs);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.invoice.firstChange) {
      this.projectHours = this.hoursPerProject(this.invoice.logs);
    }
  }

  hoursPerProject(logs: Log[]): ProjectHours[] {
    const array: ProjectHours[] = [];
    const sorted = {};
    logs.forEach(log => {
      if (sorted[log.project.name]) {
        sorted[log.project.name].push(log);
      } else {
        sorted[log.project.name] = [log];
      }
    });
    Object.keys(sorted).map(key => {
      array.push({
        project: key,
        hours: sorted[key].reduce((a: number, b: Log) => {
          return a + b.duration;
        }, 0), // tslint:disable-line
      });
    });
    return array;
  }
}
