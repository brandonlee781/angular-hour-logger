import { Component, OnInit } from '@angular/core';
import { Hero } from '../../Hero';
import { HeroService } from '../../hero.service';

@Component({
  selector: 'bl-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];
  links;

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
    this.links = [
      {
        icon: '',
        text: 'Recent Log Entries',
        isSelected: true,
      },
      {
        icon: 'folder_open',
        text: 'ASA',
        isSelected: false,
      }
    ];
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes.slice(1, 5));
  }

  onLinkSelected(link) {
    const links = this.links.map(l =>
      Object.assign({}, l, {
        isSelected: l.text === link.text ? true : false,
      })
    );
    this.links = links;
  }

}
