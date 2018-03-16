// tslint:disable:component-class-suffix
import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_PROJECT_NAMES } from 'shared/queries';
import Project from 'modules/project/Project';
import 'rxjs/add/operator/map';
import { Observable } from 'apollo-client/util/Observable';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

interface ProjectQuery {
  allProjects: {
    projects: Project[];
  };
}

interface Link {
  icon: string;
  text: string;
  id: string;
  isSelected: boolean;
}

@Component({
  selector: 'bl-log',
  templateUrl: './log.page.html',
  styleUrls: ['./log.page.scss']
})
export class LogPage implements OnInit {
  links: Link[];
  innerWidth: number;
  headerTitle: string;
  selectedProject: string;

  constructor(
    private apollo: Apollo,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'hamburger',
      sanitizer.bypassSecurityTrustResourceUrl('assets/cheese-burger.svg')
    );
  }

  ngOnInit() {
    this.headerTitle = 'Recent Log Entries';
    this.selectedProject = 'recent';
    this.apollo
      .watchQuery<ProjectQuery>({ query: GET_PROJECT_NAMES })
      .valueChanges
      .subscribe(q => {
        const recent = [{
          icon: '',
          text: 'Recent Log Entries',
          id: 'recent',
          isSelected: true,
        }];
        this.links = recent.concat(
          q.data.allProjects.projects.map(p => ({
            icon: 'folder_open',
            text: p.name,
            id: p.id,
            isSelected: false,
          }))
        );
      });
  }

  onLinkSelected(link) {
    // TODO change selected project and refresh Log query
    this.headerTitle = link.text;
    this.selectedProject = link.id;

    this.links = this.links.map(l => {
      return Object.assign({}, l, {
        isSelected: l.id === link.id ? true : false,
      });
    });
  }

}
