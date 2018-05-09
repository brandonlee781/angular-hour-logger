// tslint:disable:component-class-suffix

import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import Invoice from 'features/invoice/Invoice';
import {
  GET_ALL_INVOICES,
  GetAllInvoicesQuery,
} from 'features/invoice/schema/queries';
import { Link } from 'shared/types';

@Component({
  selector: 'bl-invoices',
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
})
export class InvoicesPage implements OnInit {
  headerTitle: string;
  selectedInvoice: string;
  links: Link[];
  loading: boolean;
  invoices: Invoice[];
  currentInvoice: Invoice;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.loading = true;
    this.apollo
      .watchQuery<GetAllInvoicesQuery>({ query: GET_ALL_INVOICES })
      .valueChanges.subscribe(q => {
        const invoices = q.data.allInvoices.invoices;
        this.invoices = invoices;
        this.links = invoices.map(inv => ({
          icon: 'receipt',
          text: `Invoice #${inv.number} - ${inv.date}`,
          id: inv.id,
          path: '/invoices',
          route: inv.number.toString(),
        }));
        this.loading = false;
      });
  }

  /**
   * Triggered when blank-state-invoice successfully
   * returns a new invoice
   * @param invoice {Invoice} - newly created invoice
   */
  // invoiceCreated(invoice: Invoice) {
  //   this.onLinkSelected({
  //     text: `Invoice #${invoice.number} - ${invoice.date}`,
  //     id: invoice.id,
  //   });
  // }
}
