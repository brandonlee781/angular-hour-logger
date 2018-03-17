// tslint:disable:component-class-suffix
import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_PROJECT_NAMES } from 'shared/queries/index';
import Project from 'modules/project/Project';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concat';
import 'rxjs/add/observable/from';
import { Observable } from 'rxjs/Observable';
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
  links$: Observable<Link[]>;
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
    const defaultLink = [{
      name: 'Recent Log Entries',
      id: 'recent',
    }];
    this.links$ = this.apollo
      .watchQuery<ProjectQuery>({ query: GET_PROJECT_NAMES })
      .valueChanges
      .map(p => defaultLink.concat(p.data.allProjects.projects))
      .map((arr: Project[]) => arr.map((proj: Project) => ({
        icon: proj.id === 'recent' ? '' : 'folder_open',
        isSelected: proj.id === 'recent' ? true : false,
        text: proj.name,
        id: proj.id,
      })));
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
