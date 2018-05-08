// tslint:disable:component-class-suffix
import { Component, OnInit } from '@angular/core';
import { MatTab } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { format } from 'date-fns';
import Invoice from 'features/invoice/Invoice';
import { DELETE_INVOICE } from 'features/invoice/schema/mutations';
import {
  GET_ALL_INVOICES,
  GET_INVOICE,
  GetAllInvoicesQuery,
  GetInvoiceQuery,
} from 'features/invoice/schema/queries';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

export interface TabEvent {
  index: number;
  tab: MatTab;
}
@Component({
  selector: 'bl-invoice-detail',
  templateUrl: './invoice-detail.page.html',
  styleUrls: ['./invoice-detail.page.scss'],
})
export class InvoiceDetailPage implements OnInit {
  invoice: Invoice;
  currentTab: string;
  open = false;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.currentTab = 'hours';
    this.route.params.subscribe(params => {
      this.apollo
        .watchQuery<GetInvoiceQuery>({
          query: GET_INVOICE,
          variables: {
            number: params.invoice,
          },
        })
        .valueChanges.subscribe(q => {
          if (q.errors) {
            this.router.navigate(['/invoices']);
          }
          this.invoice = q.data.oneInvoice.invoice;
        });
    });
  }

  tabChange({ index, tab }: TabEvent) {
    this.currentTab = tab.textLabel.toLowerCase();
  }

  downloadCSV() {
    const { invoice } = this;
    const formattedDate = format(invoice.date, 'MMMDD');
    let csv = 'Date,StartTime,EndTime,Duration,Project,Note\n';
    invoice.logs.forEach(row => {
      const date = format(row.start, 'YYYY-MM-DD');
      const startTime = format(row.start, 'H:mm');
      const endTime = format(row.end, 'H:mm');
      csv += `${date}, ${startTime}, ${endTime}, ${row.duration}, ${
        row.project.name
      }, ${row.note}`;
      csv += '\n';
    });
    const hiddenEl = document.createElement('a');
    hiddenEl.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenEl.download = formattedDate + '_hours.csv';
    hiddenEl.click();
  }

  async downloadPDF() {
    const source = document.getElementById('invoicePDF');
    const canvas = await html2canvas(source);
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF();

    pdf.addImage(imgData, 'JPEG', 0, 0);
    pdf.save(`${format(this.invoice.date, 'MMMDD')}_invoice.pdf`);
  }

  deleteInvoice() {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      const { id, date, hours, number, rate } = this.invoice;
      this.apollo
        .mutate({
          mutation: DELETE_INVOICE,
          variables: {
            id,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            deleteInvoice: {
              __typename: 'deleteInvoice',
              invoice: {
                __typename: 'Invoice',
                id,
                date,
                hours,
                number,
                rate,
              },
            },
          },
          update: (proxy, { data: { deleteInvoice } }) => {
            const data: GetAllInvoicesQuery = proxy.readQuery({
              query: GET_ALL_INVOICES,
            });
            const invoices: Invoice[] = data.allInvoices.invoices;
            const index = invoices.map(inv => inv.id).indexOf(id);
            data.allInvoices.invoices = [
              ...invoices.slice(0, index),
              ...invoices.slice(index + 1),
            ];
            proxy.writeQuery({
              query: GET_ALL_INVOICES,
              data,
            });
          },
        })
        .subscribe(data => {
          this.router.navigate(['/invoices']);
        });
    }
  }
}
