import { NgModule } from '@angular/core';
import { ProjectRoutingModule } from 'modules/project/project-routing.module';
import { ProjectPage } from './pages/project/project.page';

@NgModule({
  imports: [ProjectRoutingModule],
  declarations: [ProjectPage],
})
export class ProjectModule {}
