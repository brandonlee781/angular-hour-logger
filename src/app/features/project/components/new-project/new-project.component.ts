import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { NEW_PROJECT } from 'shared/graphql/mutations';
import { GET_PROJECT_NAMES, GetProjectNameQuery } from 'shared/graphql/queries';

@Component({
  selector: 'bl-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],
})
export class NewProjectComponent implements OnInit {
  @Output() createSuccess = new EventEmitter<any>();

  constructor(private apollo: Apollo) {}

  ngOnInit() {}

  addProject(name) {
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16);

    if (name) {
      this.apollo
        .mutate({
          mutation: NEW_PROJECT,
          variables: {
            name,
            color,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            createProject: {
              __typename: 'createProject',
              project: {
                __typename: 'Project',
                id: 'tempid',
                name,
                color,
              },
            },
          },
          update: (proxy, { data: { createProject } }) => {
            const projectQuery = { query: GET_PROJECT_NAMES };
            const data: GetProjectNameQuery = proxy.readQuery(projectQuery);
            data.allProjects.projects.push(createProject.project);
            proxy.writeQuery({ ...projectQuery, data });
          },
        })
        .subscribe();
    }

    this.createSuccess.emit();
  }
}