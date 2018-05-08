import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import Project from 'features/project/Project';
import { DELETE_TASK, TOGGLE_TASK } from 'features/project/schema/mutations';
import { GET_PROJECT_TASK } from 'features/project/schema/queries';
import Task from 'features/project/Task';

@Component({
  selector: 'bl-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.scss'],
})
export class TaskListItemComponent implements OnInit {
  @Input() task: Task;
  @Input() project: Project;
  showNewTask = false;
  confirmDelete = false;
  confirmDeleteTimeout;

  constructor(private apollo: Apollo) {}

  ngOnInit() {}

  getTotalEstimate() {
    let estimate = 0;
    estimate += this.task.estimate;

    if (this.task.children) {
      this.task.children.forEach(child => {
        estimate += child.estimate;
        if (child.children) {
          child.children.forEach(c => {
            estimate += c.estimate;
          });
        }
      });
    }
    return estimate;
  }

  toggleTask() {
    this.apollo
      .mutate({
        mutation: TOGGLE_TASK,
        variables: {
          id: this.task.id,
        },
      })
      .subscribe();
  }

  handleDelete() {
    this.confirmDelete = true;
    this.confirmDeleteTimeout = setTimeout(() => {
      this.confirmDelete = false;
    }, 5000);
  }

  deleteTask() {
    clearTimeout(this.confirmDeleteTimeout);
    this.apollo
      .mutate({
        mutation: DELETE_TASK,
        variables: {
          id: this.task.id,
        },
        refetchQueries: [
          {
            query: GET_PROJECT_TASK,
            variables: {
              project: this.project.id,
              limit: 500,
            },
          },
        ],
      })
      .subscribe();
  }
}
