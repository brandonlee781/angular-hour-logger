// tslint:disable:component-class-suffix
import 'rxjs/add/operator/map';

import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import Invoice from 'features/invoice/Invoice';
import {
  GET_ALL_INVOICES,
  GetAllInvoicesQuery,
} from 'features/invoice/schema/queries';
import { Link } from 'shared/types';

@Component({
  selector: 'bl-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {
  headerTitle: string;
  selectedInvoice: string;
  links: Link[];
  loading: boolean;
  invoices: Invoice[];
  currentInvoice: Invoice;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.loading = true;
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
        this.loading = false;
      });
  }

  /**
   * Triggered when blank-state-invoice successfully
   * returns a new invoice
   * @param invoice {Invoice} - newly created invoice
   */
  invoiceCreated(invoice: Invoice) {
    this.onLinkSelected({
      text: `Invoice #${invoice.number} - ${invoice.date}`,
      id: invoice.id,
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
}
