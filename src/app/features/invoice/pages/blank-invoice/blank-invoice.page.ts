// tslint:disable:component-class-suffix
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { format, isValid, parse } from 'date-fns';
import {
  FilterLogForm,
  NewInvoiceDialogComponent,
} from 'features/invoice/components/new-invoice-dialog/new-invoice-dialog.component';
import Invoice from 'features/invoice/Invoice';
import { NEW_INVOICE } from 'features/invoice/schema/mutations';
import {
  GET_ALL_INVOICES,
  GetAllInvoicesQuery,
} from 'features/invoice/schema/queries';
import Log from 'features/log/Log';

@Component({
  selector: 'bl-blank-invoice',
  templateUrl: './blank-invoice.page.html',
  styleUrls: ['./blank-invoice.page.scss'],
})
export class BlankInvoicePage implements OnInit {
  @Input() headerTitle: string;
  @Output() invoiceCreated = new EventEmitter<Invoice>();
  filterInputs: FilterLogForm;
  currentInvoice: Invoice;
  open = false;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {}

  openDialog(): void {
    const createInvoiceDialog = this.dialog.open(NewInvoiceDialogComponent, {
      width: '500px',
      data: { header: 'Filter Logs', ...this.filterInputs },
      position: {
        top: '16px',
        right: '16px',
      },
    });

    createInvoiceDialog.componentInstance.filteredLogs.subscribe(
      (event: FilterLogForm) => {
        const start = parse(event.startDate);
        const end = parse(event.endDate);
        if (isValid(start) || isValid(end)) {
          this.filterInputs = {
            projects: event.projects,
            startDate: isValid(start) ? format(start) : null,
            endDate: isValid(end) ? format(end) : null,
            rate: event.rate,
          };
        }
      },
    );
  }

  /**
   * When the invoice table gets a list of logs, it emits an event,
   * and this function takes that data and creates an invoice that
   * will be used if the user saves the invoice.
   * @param logs array of logs
   */
  createInvoice(logs: Log[]) {
    const date = format(logs[logs.length - 1].start, 'YYYY-MM-DD');
    const hours = logs.map(l => l.duration).reduce((a, b) => a + b, 0);
    const rate = this.filterInputs.rate;
    this.currentInvoice = {
      date,
      hours,
      rate,
      logs,
    };
  }

  saveInvoice(): void {
    const { date, hours, rate, logs } = this.currentInvoice;
    this.apollo
      .mutate({
        mutation: NEW_INVOICE,
        variables: {
          date,
          hours,
          rate,
          logs: logs.map(l => l.id),
        },
        optimisticResponse: {
          __typename: 'Mutation',
          createInvoice: {
            __typename: 'createInvoice',
            invoice: {
              __typename: 'Invoice',
              id: 'tempinvoiceid',
              date,
              hours,
              rate,
              logs,
              number: 99,
            },
          },
        },
        update: (proxy, { data: { createInvoice } }) => {
          const data: GetAllInvoicesQuery = proxy.readQuery({
            query: GET_ALL_INVOICES,
          });
          data.allInvoices.invoices.unshift(createInvoice.invoice);
          proxy.writeQuery({
            query: GET_ALL_INVOICES,
            data,
          });
        },
      })
      .subscribe(q => {
        const inv = q.data.createInvoice.invoice;
        this.currentInvoice = null;
        this.router.navigate(['/invoices', inv.number]);
      });
  }
}
