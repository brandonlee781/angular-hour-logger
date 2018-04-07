// tslint:disable:component-class-suffix
import 'rxjs/add/operator/map';

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Apollo } from 'apollo-angular';
import { format } from 'date-fns';
import {
  FilterLogForm,
  NewInvoiceDialogComponent,
} from 'features/invoice/components/new-invoice-dialog/new-invoice-dialog.component';
import Invoice from 'features/invoice/Invoice';
import Log from 'features/log/Log';
import { NEW_INVOICE } from 'shared/graphql/mutations';
import { GET_ALL_INVOICES, GetAllInvoicesQuery } from 'shared/graphql/queries';
import { Link } from 'shared/types';

export interface FilteredLogsEvent {
  logs: Log[];
  inputs: FilterLogForm;
}

@Component({
  selector: 'bl-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {
  headerTitle: string;
  selectedInvoice: string;
  links: Link[];
  invoices: Invoice[];
  currentInvoice: Invoice;
  filterInputs: FilterLogForm;

  constructor(private apollo: Apollo, public dialog: MatDialog) {}

  ngOnInit() {
    this.headerTitle = 'Create New Invoice';
    this.selectedInvoice = 'recent';
    const defaultLink: Array<{ id?: string; date?: string }> = [
      {
        date: 'Create New Invoice',
        id: 'recent',
      },
    ];
    this.apollo
      .watchQuery<GetAllInvoicesQuery>({ query: GET_ALL_INVOICES })
      .valueChanges.subscribe(q => {
        const invoices = q.data.allInvoices.invoices;
        const links = defaultLink.concat(invoices).map((inv: Invoice) => ({
          icon: inv.id === 'recent' ? '' : 'receipt',
          isSelected: inv.id === 'recent' ? true : false,
          text:
            inv.id === 'recent'
              ? inv.date
              : `Invoice #${inv.number} - ${inv.date}`,
          id: inv.id,
        }));
        this.invoices = invoices;
        this.links = links;
      });
  }

  onLinkSelected(link) {
    this.headerTitle = link.text;
    this.selectedInvoice = link.id;
    this.currentInvoice = this.invoices.find(i => i.id === link.id);

    this.links = this.links.map(l => {
      return Object.assign({}, l, {
        isSelected: l.id === link.id ? true : false,
      });
    });
  }

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
      (event: FilteredLogsEvent) => {
        this.filterInputs = event.inputs;
        if (event.logs.length) {
          const tempInvoice: Invoice = {
            date: format(event.inputs.endDate, 'YYYY-MM-DD'),
            hours: event.logs.map(l => l.duration).reduce((a, b) => a + b, 0),
            rate: event.inputs.rate,
            logs: event.logs,
          };
          this.currentInvoice = tempInvoice;
        } else {
          this.currentInvoice = null;
        }
      },
    );
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
              number: this.invoices.length + 1,
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
        this.onLinkSelected({
          text: `Invoice #${inv.number} - ${inv.date}`,
          id: inv.id,
        });
      });
  }
}
