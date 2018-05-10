import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import Project from 'features/project/Project';
import { TOGGLE_PROJECT_FAVORITE, UPDATE_PROJECT_COLOR } from 'features/project/schema/mutations';
import {
  GET_PROJECT_NAMES,
  GET_PROJECT_TASK,
  GetProjectNameQuery,
  GetProjectTasksQuery,
} from 'features/project/schema/queries';
import Task from 'features/project/Task';
import { map } from 'rxjs/operators';

// tslint:disable:component-class-suffix

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
  tasks: Task[] = [];
  open = false;
  mdColors = [
    '#ef5350',
    '#f44336',
    '#e53935',
    '#ec407a',
    '#e91e63',
    '#d81b60',
    '#ab47bc',
    '#9c27b0',
    '#8e24aa',
    '#7e57c2',
    '#673ab7',
    '#5e35b1',
    '#5c6bc0',
    '#3f51b5',
    '#3949ab',
    '#42a5f5',
    '#2196f3',
    '#1e88e5',
    '#29b6f6',
    '#03a9f4',
    '#039be5',
    '#26c6da',
    '#00bcd4',
    '#00acc1',
    '#26a69a',
    '#009688',
    '#00897b',
    '#66bb6a',
    '#4caf50',
    '#43a047',
    '#9ccc65',
    '#8bc34a',
    '#d4e157',
    '#cddc39',
    '#c0ca33',
    '#ffee58',
    '#ffeb3b',
    '#fdd835',
    '#ffca28',
    '#ffc107',
    '#ffb300',
    '#ffa726',
    '#ff9800',
    '#fb8c00',
    '#ff7043',
    '#ff5722',
    '#f4511e',
    '#8d6e63',
    '#795548',
    '#6d4c41',
  ];

  taskText = new FormControl('', [Validators.required]);
  taskPriority = 0;
  taskEstimate = 0;

  constructor(private apollo: Apollo, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.apollo
        .watchQuery<GetProjectNameQuery>({ query: GET_PROJECT_NAMES })
        .valueChanges.pipe(map(p => p.data.allProjects.projects))
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

  editColor(event) {
    this.apollo
      .mutate({
        mutation: UPDATE_PROJECT_COLOR,
        variables: {
          id: this.project.id,
          color: event,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateProject: {
            __typename: 'updateProject',
            project: {
              __typename: 'Project',
              id: this.project.id,
              name: this.project.name,
              color: event,
              completed: this.project.favorite,
            },
          },
        },
        refetchQueries: [
          {
            query: GET_PROJECT_NAMES,
            variables: {
              project: this.project.id,
              limit: 500,
            },
          },
        ],
      })
      .subscribe();
  }

  toggleFavorite() {
    this.apollo
      .mutate({
        mutation: TOGGLE_PROJECT_FAVORITE,
        variables: {
          id: this.project.id,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          toggleProjectFavorite: {
            __typename: 'toggleProjectFavorite',
            project: {
              __typename: 'Project',
              id: this.project.id,
              name: this.project.name,
              color: this.project.color,
              completed: !this.project.favorite,
            },
          },
        },
        refetchQueries: [
          {
            query: GET_PROJECT_NAMES,
          },
        ],
        // update: (proxy, { data: { toggleProjectFavorite } }) => {
        //   const projectQuery = {
        //     query: GET_PROJECT_NAMES,
        //   };
        //   const data: GetProjectNameQuery = proxy.readQuery(projectQuery);
        //   const projectIndex = data.allProjects.projects.findIndex(p => p.id === this.project.id);
        //   data.allProjects.projects[projectIndex].favorite = !data.allProjects.projects[projectIndex].favorite

        //   proxy.writeQuery({ ...projectQuery, data });
        // },
      }).subscribe();
  }
}
