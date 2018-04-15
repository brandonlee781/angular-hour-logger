import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { User } from 'features/user/User';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { GET_USER, GetUserQuery } from 'shared/graphql/queries';

@Injectable()
export class UserService {
  private _user: BehaviorSubject<User> = new BehaviorSubject({
    id: null,
    email: null,
    address: null,
    city: null,
    state: null,
    zip: null,
  });
  public user: Observable<User> = this._user.asObservable();

  constructor(private readonly apollo: Apollo) {
    this.getUser();
  }

  getUser() {
    this.apollo
      .watchQuery<GetUserQuery>({ query: GET_USER })
      .valueChanges.subscribe(result => {
        this._user.next(result.data.getUser);
      });
  }
}
