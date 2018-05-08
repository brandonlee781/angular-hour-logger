import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { FilterLogForm } from 'features/invoice/components/new-invoice-dialog/new-invoice-dialog.component';
import Invoice from 'features/invoice/Invoice';
import { InvoiceDataSource } from 'features/invoice/invoice.datasource';
import Log from 'features/log/Log';

@Component({
  selector: 'bl-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss'],
})
export class InvoiceTableComponent implements OnInit, OnChanges {
  @Input() invoice: Invoice;
  @Input() filterInputs: FilterLogForm;
  @Output() currentLogs = new EventEmitter<Log[]>();
  dataSource: InvoiceDataSource;
  displayedColumns = ['date', 'start', 'end', 'duration', 'project', 'note'];

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.dataSource = new InvoiceDataSource(this.apollo);
    if (!this.filterInputs && this.invoice) {
      this.dataSource.getInvoice(this.invoice.id);
    } else if (this.filterInputs) {
      this.dataSource.getLogsByDates(
        this.filterInputs.startDate,
        this.filterInputs.endDate,
        this.filterInputs.projects,
      );
    }
    this.dataSource.logs$.subscribe(data => {
      if (data.length) {
        this.currentLogs.emit(data);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.filterInputs && !changes.invoice.firstChange) {
      this.dataSource.getInvoice(this.invoice.id);
    } else if (this.filterInputs && !changes.filterInputs.firstChange) {
      this.dataSource.getLogsByDates(
        this.filterInputs.startDate,
        this.filterInputs.endDate,
        this.filterInputs.projects,
      );
    }
  }
}
