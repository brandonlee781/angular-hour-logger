import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'shared/services/user.service';

import { environment } from '../../../environments/environment';

const storage = window.localStorage;

@Component({
  selector: 'bl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  ngOnInit() {}

  async submitLogin() {
    const { email, password } = this;
    const url = environment.apiUrl + '/auth/token';
    const body = { email, password };

    const data = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await data.json();
    storage.setItem('token', response.access_token);
    this.userService.getUser();
    this.router.navigate(['home']);
  }
}
