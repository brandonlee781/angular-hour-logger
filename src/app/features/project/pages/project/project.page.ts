// tslint:disable:component-class-suffix
import 'rxjs/add/operator/map';

import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import Project from 'features/project/Project';
import {
  GET_PROJECT_NAMES,
  GET_PROJECT_TASK,
  GetProjectNameQuery,
  GetProjectTasksQuery,
} from 'features/project/schema/queries';
import Task from 'features/project/Task';

interface Link {
  icon: string;
  text: string;
  id: string;
  isSelected: boolean;
}

@Component({
  selector: 'bl-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {
  project: Project;
  tasks: Task[];
  open = false;

  taskText = new FormControl('', [Validators.required]);
  taskPriority = 0;
  taskEstimate = 0;

  constructor(private apollo: Apollo, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.apollo
        .watchQuery<GetProjectNameQuery>({ query: GET_PROJECT_NAMES })
        .valueChanges.map(p => p.data.allProjects.projects)
        .subscribe((projects: Project[]) => {
          this.project = projects.find(
            proj => proj.name === params.project || proj.name === '',
          );
          this.getTasks(this.project.id);
        });
    });
  }

  getTasks(id) {
    this.apollo
      .watchQuery<GetProjectTasksQuery>({
        query: GET_PROJECT_TASK,
        variables: {
          project: id,
          limit: 500,
        },
      })
      .valueChanges.subscribe(data => {
        this.tasks = data.data.projectTasks.tasks;
      });
  }

  ngOnInit() {}
}
