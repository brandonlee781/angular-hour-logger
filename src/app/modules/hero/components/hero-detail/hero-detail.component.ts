import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Apollo } from 'apollo-angular';

import { HeroService } from '../../hero.service';
import { Hero } from '../../Hero';
import gql from 'graphql-tag';

@Component({
  selector: 'bl-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.getHero();
    this.apollo.query({ query: gql`
      { allLogs{ logs { id } } }
    `}).subscribe(console.log);
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void {
    this.location.back();
  }

}
