import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { User } from 'features/user/User';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'shared/services/user.service';

@Component({
  selector: 'bl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  user: User;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.user.subscribe(user => (this.user = user));
  }
}
