import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Apollo } from 'apollo-angular';
import { differenceInMinutes, parse } from 'date-fns';
import Log from 'features/log/Log';
import Project from 'features/project/Project';
import { Observable } from 'rxjs/Observable';
import { logTimeValidator } from 'shared/directives/log-time-validator.directive';
import { GET_PROJECT_NAMES, GetProjectNameQuery } from 'shared/graphql/queries';

import { LogErrorStateMatcher } from './LogErrorStateMatcher';

interface DialogData extends Log {
  header: string;
}
@Component({
  selector: 'bl-new-log-dialog',
  templateUrl: './new-log-dialog.component.html',
  styleUrls: ['./new-log-dialog.component.scss'],
})
export class NewLogDialogComponent implements OnInit {
  projects$: Observable<Project[]>;
  project;

  id;
  date;
  startTime;
  endTime;
  note;
  duration = 0;
  newLogForm: FormGroup;
  endTimeMatcher = new LogErrorStateMatcher();

  editProject: string;

  constructor(
    public dialogRef: MatDialogRef<NewLogDialogComponent>,
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
    this.newLogForm = this.fb.group(
      {
        id: [data.id],
        project: [data.project ? data.project.id : null, Validators.required],
        date: [parse(data.start), Validators.required],
        startTime: [parse(data.start), Validators.required],
        endTime: [parse(data.end), Validators.required],
        note: [
          data.note || null,
          Validators.compose([Validators.required, Validators.maxLength(255)]),
        ],
      },
      {
        validator: logTimeValidator(),
      },
    );
    this.durationChange();
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
        Object.assign({}, this.newLogForm.value, {
          duration: this.duration,
          project: {
            id: this.newLogForm.value.project,
            name: projectName,
          },
        }),
      );
    }
  }

  getErrorMessage() {
    return this.newLogForm.hasError('logTime');
  }
}
