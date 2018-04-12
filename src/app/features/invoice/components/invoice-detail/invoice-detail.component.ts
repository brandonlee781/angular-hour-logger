import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatTab } from '@angular/material';
import { Apollo } from 'apollo-angular';
import { format } from 'date-fns';
import Invoice from 'features/invoice/Invoice';
import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import { DELETE_INVOICE } from 'shared/graphql/mutations';
import {
  GET_ALL_INVOICES,
  GET_INVOICE,
  GetAllInvoicesQuery,
  GetInvoiceQuery,
} from 'shared/graphql/queries';

export interface TabEvent {
  index: number;
  tab: MatTab;
}
@Component({
  selector: 'bl-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
})
export class InvoiceDetailComponent implements OnInit, OnChanges {
  @Input() selectedInvoice: string;
  @Input() headerTitle: string;
  @Output() invoiceDeleted = new EventEmitter<any>();
  invoice: Invoice;
  currentTab: string;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.currentTab = 'hours';
    this.apollo
      .watchQuery<GetInvoiceQuery>({
        query: GET_INVOICE,
        variables: {
          id: this.selectedInvoice,
        },
      })
      .valueChanges.subscribe(q => {
        this.invoice = q.data.oneInvoice.invoice;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.selectedInvoice.firstChange) {
      this.apollo
        .watchQuery<GetInvoiceQuery>({
          query: GET_INVOICE,
          variables: {
            id: this.selectedInvoice,
          },
        })
        .valueChanges.subscribe(q => {
          this.invoice = q.data.oneInvoice.invoice;
        });
    }
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
          this.invoiceDeleted.emit();
        });
    }
  }
}
