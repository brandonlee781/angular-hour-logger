// tslint:disable:component-class-suffix
import 'rxjs/add/operator/map';

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import Project from 'features/project/Project';
import {
  GET_PROJECT_NAMES,
  GetProjectNameQuery,
} from 'features/project/schema/queries';
import { Observable } from 'rxjs/Observable';
import { Link } from 'shared/types';

@Component({
  selector: 'bl-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage implements OnInit {
  links$: Observable<Link[]>;
  projects$: Observable<Project[]>;
  headerTitle: string;
  selectedProject: string;
  showNewProject = false;
  open = false;

  taskText = new FormControl('', [Validators.required]);
  taskPriority = 0;
  taskEstimate = 0;

  constructor(private apollo: Apollo, private location: Location) {}

  ngOnInit() {
    this.headerTitle = 'Select a Project';
    this.links$ = this.apollo
      .watchQuery<GetProjectNameQuery>({ query: GET_PROJECT_NAMES })
      .valueChanges.map(p => p.data.allProjects.projects)
      .map((arr: Project[], index: number) =>
        arr.map((proj: Project) => ({
          icon: 'folder_open',
          path: '/projects',
          route: proj.name,
          text: proj.name,
          id: proj.id,
        })),
      );
  }

  createNewProject(event) {}
}
