import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import Log from 'features/log/Log';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import {
  GET_INVOICE,
  GET_LOGS_BY_DATES,
  GetInvoiceQuery,
  GetLogsByDatesQuery,
} from 'shared/graphql/queries';

export class InvoiceDataSource extends DataSource<Log> {
  private logsSubject = new BehaviorSubject<Log[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public logs$ = this.logsSubject.asObservable();

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

  getInvoice(id) {
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

  getLogsByDates(start, end, projects) {
    this.loadingSubject.next(true);
    this.apollo
      .watchQuery<GetLogsByDatesQuery>({
        query: GET_LOGS_BY_DATES,
        variables: {
          project: projects || null,
          start: start ? start : new Date('1970-01-01'),
          end: end ? end : new Date('2100-01-01'),
          limit: 1000,
          offset: 0,
        },
      })
      .valueChanges.subscribe(q => {
        this.loadingSubject.next(false);
        return this.logsSubject.next(q.data.allLogsByDates.logs);
      });
  }
}
