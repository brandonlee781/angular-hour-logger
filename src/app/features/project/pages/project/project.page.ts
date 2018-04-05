// tslint:disable:component-class-suffix
import 'rxjs/add/operator/map';

import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import Project from 'features/project/Project';
import { Observable } from 'rxjs/Observable';
import { GET_PROJECT_NAMES, GetProjectNameQuery } from 'shared/graphql/queries';

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
  links$: Observable<Link[]>;
  projects$: Observable<Project[]>;
  headerTitle: string;
  selectedProject: string;
  showNewProject = false;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.headerTitle = 'Recent Log Entries';
    this.links$ = this.apollo
      .watchQuery<GetProjectNameQuery>({ query: GET_PROJECT_NAMES })
      .valueChanges.map(p => p.data.allProjects.projects)
      .map((arr: Project[], index: number) =>
        arr.map((proj: Project) => ({
          icon: 'folder_open',
          isSelected: false,
          text: proj.name,
          id: proj.id,
        })),
      );
  }

  createNewProject(event) {
    console.log(event);
  }

  onLinkSelected(link) {
    this.headerTitle = link.text;
    this.selectedProject = link.id;

    this.links$ = this.links$.map(links => {
      return links.map(l => {
        return Object.assign({}, l, {
          isSelected: l.id === link.id ? true : false,
        });
      });
    });
  }
}
