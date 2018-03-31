import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NavDrawerService {
  public isNavDrawerOpen = new Subject<boolean>();

  isNavDrawerOpen$ = this.isNavDrawerOpen.asObservable();

  constructor() {}

  setValue(val: boolean) {
    this.isNavDrawerOpen.next(val);
  }
}
