import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Apollo } from 'apollo-angular';
import { isAfter, isBefore, parse } from 'date-fns';
import { GET_INVOICE, GetInvoiceQuery } from 'features/invoice/schema/queries';
import Log from 'features/log/Log';
import {
  GET_LOGS_BY_DATES,
  GetLogsByDatesQuery,
} from 'features/log/schema/queries';
import { BehaviorSubject, Observable } from 'rxjs';

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
        const logs = q.data.oneInvoice.invoice.logs.slice();
        logs.sort((a, b) => {
          const aDate = parse(a.start);
          const bDate = parse(b.start);
          if (isBefore(aDate, bDate)) {
            return -1;
          }
          if (isAfter(aDate, bDate)) {
            return 1;
          }
          return 0;
        });

        this.loadingSubject.next(false);
        return this.logsSubject.next(logs);
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
