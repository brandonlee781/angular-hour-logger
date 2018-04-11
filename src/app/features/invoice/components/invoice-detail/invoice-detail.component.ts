import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Apollo } from 'apollo-angular';
import Invoice from 'features/invoice/Invoice';
import { Observable } from 'rxjs/Observable';
import { GET_INVOICE, GetInvoiceQuery } from 'shared/graphql/queries';

@Component({
  selector: 'bl-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
})
export class InvoiceDetailComponent implements OnInit, OnChanges {
  @Input() selectedInvoice: string;
  @Input() headerTitle: string;
  invoice: Invoice;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
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
}
