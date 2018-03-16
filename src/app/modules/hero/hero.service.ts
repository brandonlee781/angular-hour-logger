import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { MessageService } from 'shared/services/message.service';

import { Hero } from './Hero';
import { HEROES } from './mock-heroes';

@Injectable()
export class HeroService {

  constructor(private readonly messageService: MessageService) { }

  getHero(id: number): Observable<Hero> {
    // TODO: send the message _AFTER_ fetching the hero
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(HEROES.find(hero => hero.id === id));
  }

  getHeroes(): Observable<Hero[]> {
    // TODO: send the message _AFTER_ fetching the heroes
    this.messageService.add('HeroService: fetched heroes');
    return of(HEROES);
  }

}
