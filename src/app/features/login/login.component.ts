import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { addSeconds } from 'date-fns';
import { UserService } from 'shared/services/user.service';
import { AuthResponse } from 'shared/types';

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
    const response: AuthResponse = await data.json();
    const expiresAt = addSeconds(new Date(), response.expires_in);
    storage.setItem(
      'token',
      JSON.stringify({
        access_token: response.access_token,
        expiresAt,
      }),
    );
    this.userService.getUser();
    this.router.navigate(['home']);
  }
}
