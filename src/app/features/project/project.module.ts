import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GraphqlModule } from 'core/graphql.module';
import { MaterialModule } from 'core/material.module';
import { ProjectRoutingModule } from 'features/project/project-routing.module';
import { SharedModule } from 'shared/shared.module';

import { NewProjectComponent } from './components/new-project/new-project.component';
import { ProjectPage } from './pages/project/project.page';

@NgModule({
  imports: [
    CommonModule,
    GraphqlModule,
    MaterialModule,
    ProjectRoutingModule,
    SharedModule,
  ],
  declarations: [ProjectPage, NewProjectComponent],
})
export class ProjectModule {}
