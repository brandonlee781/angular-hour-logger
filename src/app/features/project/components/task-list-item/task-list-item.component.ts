import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Apollo } from 'apollo-angular';
import Project from 'features/project/Project';
import { DELETE_TASK, TOGGLE_TASK, EDIT_TASK } from 'features/project/schema/mutations';
import { GET_PROJECT_TASK, GetProjectTasksQuery } from 'features/project/schema/queries';
import Task from 'features/project/Task';

@Component({
  selector: 'bl-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.scss'],
})
export class TaskListItemComponent implements OnInit {
  @Input() task: Task;
  @Input() project: Project;
  @Input() parent: string;
  @Input() showCompleted;
  @ViewChild('editInput') editInputEl: ElementRef;
  editText: string;
  showNewTask = false;
  showChildren = true;
  confirmDelete = false;
  confirmDeleteTimeout;
  isEditing = false;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.editText = this.task.text;
  }

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

  editTask() {
    if (!this.task.completed) {
      this.isEditing = !this.isEditing;
      setTimeout(() => {
        this.editInputEl.nativeElement.focus();
      }, 1);
    }
  }
  confirmEditTask() {
    const newText = this.editText;
    const newEstimate = this.task.estimate;

    this.apollo.mutate({
      mutation: EDIT_TASK,
      variables: {
        id: this.task.id,
        text: newText,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateTask: {
          __typename: 'updateTask',
          task: {
            __typename: 'Task',
            id: this.task.id,
            text: newText,
            completed: this.task.completed,
          },
        },
      },
      update: (proxy, { updateTask }) => {
        const tasksQuery = {
          query: GET_PROJECT_TASK,
          variables: {
            project: this.project.id,
            limit: 500,
          },
        };
        const data: GetProjectTasksQuery = proxy.readQuery(tasksQuery);
        const taskInd = data.projectTasks.tasks.findIndex(t => t.id === this.task.id);
        data.projectTasks.tasks[taskInd] = updateTask.task;

        proxy.writeQuery({ ...tasksQuery, data });
      },
    }).subscribe();
    this.isEditing = !this.isEditing;
  }
}
