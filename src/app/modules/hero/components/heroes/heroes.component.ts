import { Component, OnInit } from '@angular/core';
import { Hero } from '../../Hero';
import { HeroService } from '../../hero.service';
import { MessageService } from 'shared/services/message.service';

@Component({
  selector: 'bl-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];
  selectedHero: Hero;

  constructor(
    private readonly heroService: HeroService,
    private readonly messageService: MessageService,
  ) { }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  ngOnInit() {
    this.getHeroes();
  }

}
