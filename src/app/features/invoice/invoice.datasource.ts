import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import Invoice from 'features/invoice/Invoice';
import Log from 'features/log/Log';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, finalize } from 'rxjs/operators';
import { GET_INVOICE, GetInvoiceQuery } from 'shared/graphql/queries';

export class InvoiceDataSource extends DataSource<Log> {
  private logsSubject = new BehaviorSubject<Log[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private apollo: Apollo) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<Log[]> {
    return this.logsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.logsSubject.complete();
    this.loadingSubject.complete();
  }

  loadLogs(id) {
    this.loadingSubject.next(true);
    this.apollo
      .watchQuery<GetInvoiceQuery>({
        query: GET_INVOICE,
        variables: {
          id,
        },
      })
      .valueChanges.subscribe(q => {
        this.loadingSubject.next(false);
        return this.logsSubject.next(q.data.oneInvoice.invoice.logs);
      });
  }
}
