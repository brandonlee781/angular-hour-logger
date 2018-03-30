import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Apollo } from 'apollo-angular';
import { differenceInMinutes, format } from 'date-fns';
import Log from 'features/log/Log';
import Project from 'features/project/Project';
import { Observable } from 'rxjs/Observable';
import { logTimeValidator } from 'shared/directives/log-time-validator.directive';
import { NEW_LOG } from 'shared/graphql/mutations';
import {
  GET_PROJECT_NAMES,
  GetProjectNameQuery,
  LOG_LIST_QUERY,
  LogListQuery,
} from 'shared/graphql/queries';

import { LogErrorStateMatcher } from './LogErrorStateMatcher';

@Component({
  selector: 'bl-new-log-dialog',
  templateUrl: './new-log-dialog.component.html',
  styleUrls: ['./new-log-dialog.component.scss'],
})
export class NewLogDialogComponent implements OnInit {
  projects$: Observable<Project[]>;
  project: Project;
  date: string;
  startTime: string;
  endTime: string;
  note: string;
  duration = 0;
  newLogForm: FormGroup;
  endTimeMatcher = new LogErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<NewLogDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder,
    private apollo: Apollo,
  ) {
    this.createForm();
    this.durationChange();
  }

  ngOnInit() {
    this.projects$ = this.apollo
      .watchQuery<GetProjectNameQuery>({ query: GET_PROJECT_NAMES })
      .valueChanges.map(p => p.data.allProjects.projects);
  }

  createForm(): void {
    this.newLogForm = this.fb.group(
      {
        project: [null, Validators.required],
        date: [null, Validators.required],
        startTime: [null, Validators.required],
        endTime: [null, Validators.required],
        note: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(255)]),
        ],
      },
      {
        validator: logTimeValidator(),
      },
    );
  }

  durationChange(): void {
    const startTime = this.newLogForm.get('startTime');
    const endTime = this.newLogForm.get('endTime');

    endTime.valueChanges.subscribe(
      val =>
        (this.duration =
          differenceInMinutes(endTime.value, startTime.value) / 60),
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  saveLog(): void {
    if (this.newLogForm.valid) {
      const self = this;
      let projectName;
      self.projects$
        .map(projects =>
          projects.find(p => p.id === this.newLogForm.value.project),
        )
        .subscribe(project => (projectName = project.name));

      this.dialogRef.close(
        Object.assign({}, this.newLogForm.value, { duration: this.duration }),
        {
          project: {
            id: this.newLogForm.value.project,
            name: projectName,
          },
        },
      );
    }
  }

  getErrorMessage() {
    return this.newLogForm.hasError('logTime');
  }
}
