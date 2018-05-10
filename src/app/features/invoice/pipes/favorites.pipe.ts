import { Pipe, PipeTransform } from '@angular/core';
import Project from 'features/project/Project';

@Pipe({
  name: 'favorites',
})
export class FavoritesPipe implements PipeTransform {

  transform(projects: Project[], args?: any): any {
    return projects.filter(p => p.favorite === true);
  }

}
