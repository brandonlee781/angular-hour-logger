import { Component, OnInit, Input, Output, EventEmitter, HostListener, ContentChildren } from '@angular/core';

@Component({
  selector: 'bl-nav-drawer',
  templateUrl: './nav-drawer.component.html',
  styleUrls: ['./nav-drawer.component.scss']
})
export class NavDrawerComponent implements OnInit {
  @Input() links;
  @Output() selected: EventEmitter<any> = new EventEmitter();
  innerWidth: number;
  isOpened: boolean;

  constructor() {}

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth >= 960) {
      this.isOpened = true;
    } else {
      this.isOpened = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth >= 960) {
      this.isOpened = true;
    } else {
      this.isOpened = false;
    }
  }

  toggleDrawer() {
    this.isOpened = !this.isOpened;
  }

  changeSelected(link) {
    this.selected.emit(link);
  }

}
