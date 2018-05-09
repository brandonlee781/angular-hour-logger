import { map } from 'rxjs/operators';

import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Apollo } from 'apollo-angular';
import { parse } from 'date-fns';
import Project from 'features/project/Project';
import {
  GET_PROJECT_NAMES,
  GetProjectNameQuery,
} from 'features/project/schema/queries';
import { Observable } from 'rxjs';

export interface FilterLogForm {
  projects: string;
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
  projectIds: string[];
  filterLogsForm: FormGroup;
  @Output() filteredLogs = new EventEmitter<FilterLogForm>();

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
      .valueChanges.pipe(map(p => p.data.allProjects.projects));
    this.projects$.subscribe(project => {
      this.filterLogsForm.patchValue({
        projects: project.map(p => p.id),
      });
    });
  }

  createForm(data): void {
    this.filterLogsForm = this.fb.group({
      projects: [data.project ? data.project : null],
      rate: [data.rate ? data.rate : 25, Validators.required],
      startDate: [parse(data.startDate), Validators.required],
      endDate: [parse(data.endDate), Validators.required],
    });
    this.filterLogsForm.valueChanges.subscribe((inputs: FilterLogForm) => {
      this.filteredLogs.emit(inputs);
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
      projects: null,
      startDate: null,
      endDate: null,
      rate: 25,
    };
    this.filterLogsForm.reset(inputs);
    this.filteredLogs.emit(inputs);
  }
}
