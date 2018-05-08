import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { GraphqlModule } from 'core/graphql.module';
import { MaterialModule } from 'core/material.module';
import { ProjectsPage } from 'features/project/pages/projects/projects.page';
import { ProjectRoutingModule } from 'features/project/project-routing.module';
import { UIModule } from 'features/ui/ui.module';
import { MccColorPickerModule } from 'material-community-components';

import { DurationPickerComponent } from './components/duration-picker/duration-picker.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { TaskListItemComponent } from './components/task-list-item/task-list-item.component';
import { ProjectPage } from './pages/project/project.page';
import { CompletedTaskPipe } from './pipes/completed-task.pipe';

@NgModule({
  imports: [
    CommonModule,
    EcoFabSpeedDialModule,
    FormsModule,
    ReactiveFormsModule,
    GraphqlModule,
    MaterialModule,
    MccColorPickerModule,
    ProjectRoutingModule,
    UIModule,
  ],
  declarations: [
    ProjectPage,
    NewProjectComponent,
    DurationPickerComponent,
    NewTaskComponent,
    ProjectsPage,
    TaskListItemComponent,
    CompletedTaskPipe,
  ],
})
export class ProjectModule {}
