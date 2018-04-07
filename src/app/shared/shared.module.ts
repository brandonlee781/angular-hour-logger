import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'core/material.module';

@NgModule({
  imports: [CommonModule, MaterialModule, LayoutModule],
})
export class SharedModule {}
