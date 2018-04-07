import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Apollo } from 'apollo-angular';
import { format, isValid, parse } from 'date-fns';
import { FilteredLogsEvent } from 'features/invoice/pages/invoice/invoice.page';
import Project from 'features/project/Project';
import { Observable } from 'rxjs/Observable';
import {
  GET_LOGS_BY_DATES,
  GET_PROJECT_NAMES,
  GetLogsByDatesQuery,
  GetProjectNameQuery,
} from 'shared/graphql/queries';
export interface FilterLogForm {
  project: string;
  startDate: string;
  endDate: string;
  rate: number;
}

interface DialogData extends FilterLogForm {
  header: string;
}

@Component({
  selector: 'bl-new-invoice-dialog',
  templateUrl: './new-invoice-dialog.component.html',
  styleUrls: ['./new-invoice-dialog.component.scss'],
})
export class NewInvoiceDialogComponent implements OnInit {
  projects$: Observable<Project[]>;
  filterLogsForm: FormGroup;
  @Output() filteredLogs = new EventEmitter<FilteredLogsEvent>();

  constructor(
    public dialogRef: MatDialogRef<NewInvoiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public fb: FormBuilder,
    private apollo: Apollo,
  ) {
    this.createForm(data);
  }

  ngOnInit() {
    this.projects$ = this.apollo
      .watchQuery<GetProjectNameQuery>({ query: GET_PROJECT_NAMES })
      .valueChanges.map(p => p.data.allProjects.projects);
  }

  createForm(data): void {
    this.filterLogsForm = this.fb.group({
      project: [data.project ? data.project : null],
      rate: [data.rate ? data.rate : 25, Validators.required],
      startDate: [parse(data.startDate), Validators.required],
      endDate: [parse(data.endDate), Validators.required],
    });
    this.filterLogsForm.valueChanges.subscribe((inputs: FilterLogForm) => {
      const start = parse(inputs.startDate);
      const end = parse(inputs.endDate);
      if (isValid(start) || isValid(end)) {
        this.apollo
          .watchQuery<GetLogsByDatesQuery>({
            query: GET_LOGS_BY_DATES,
            variables: {
              project: inputs.project || null,
              start: isValid(start)
                ? format(start, 'YYYY-MM-DD')
                : new Date('1970-01-01'),
              end: isValid(end)
                ? format(end, 'YYYY-MM-DD')
                : new Date('2100-01-01'),
              limit: 1000,
              offset: 0,
            },
          })
          .valueChanges.subscribe(q => {
            this.filteredLogs.emit({
              logs: q.data.allLogsByDates.logs,
              inputs,
            });
          });
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  clearForm(): void {
    const inputs = {
      project: null,
      startDate: null,
      endDate: null,
      rate: 25,
    };
    this.filterLogsForm.reset(inputs);
    this.filteredLogs.emit({ logs: [], inputs });
  }
}