import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { isAfter } from 'date-fns';
import { AuthResponse } from 'shared/types';

import { environment } from '../../environments/environment';

const storage = window.localStorage;

@NgModule({
  exports: [HttpClientModule, ApolloModule, HttpLinkModule],
})
export class GraphqlModule {
  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
    private router: Router,
  ) {
    const http = httpLink.create({ uri: environment.apiUrl + '/graphql' });
    const linkError = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) => {
          if (message === 'Invalid token' && router.url !== '/login') {
            router.navigate(['/login']);
          }
        });
        return graphQLErrors;
      }

      if (networkError) {
        console.error(networkError);
      }
    });

    apollo.create({
      link: this.getContext()
        .concat(linkError)
        .concat(http),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'all',
        },
      },
    });
  }

  getContext() {
    return setContext((_, { headers }) => {
      const token: AuthResponse = JSON.parse(storage.getItem('token'));
      if (
        !token ||
        !token.access_token ||
        isAfter(new Date(), token.expiresAt)
      ) {
        if (this.router.url !== '/login') {
          return this.router.navigate(['/home']);
        }
        return null;
      } else {
        return {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        };
      }
    });
  }
}
