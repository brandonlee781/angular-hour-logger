import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Apollo } from 'apollo-angular';
import Invoice from 'features/invoice/Invoice';
import { InvoiceDataSource } from 'features/invoice/invoice.datasource';

@Component({
  selector: 'bl-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss'],
})
export class InvoiceTableComponent implements OnInit, OnChanges {
  @Input() selectedInvoice: string;
  @Input() tempInvoice: Invoice;
  dataSource: InvoiceDataSource;
  displayedColumns = ['date', 'start', 'end', 'duration', 'project', 'note'];

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    if (!this.tempInvoice) {
      this.dataSource = new InvoiceDataSource(this.apollo);
      this.dataSource.loadLogs(this.selectedInvoice);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.tempInvoice && !changes.selectedInvoice.firstChange) {
      this.dataSource.loadLogs(this.selectedInvoice);
    }
  }
}
