import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { HeroService } from './hero.service';

import { HeroDetailComponent } from './components/hero-detail/hero-detail.component';
import { HeroesComponent } from './components/heroes/heroes.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { NavDrawerComponent } from 'shared/components/nav-drawer/nav-drawer.component';
import { MaterialModule } from '../../material.module';
import { NavDrawerItemComponent } from 'shared/components/nav-drawer-item/nav-drawer-item.component';

@NgModule({
  imports: [BrowserModule, FormsModule, RouterModule, MaterialModule],
  exports: [HeroesComponent, HeroDetailComponent, DashboardComponent],
  declarations: [HeroDetailComponent, HeroesComponent, DashboardComponent],
  providers: [HeroService],
})
export class HeroModule {}
