import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';

import { environment } from '../../environments/environment';

@NgModule({
  exports: [HttpClientModule, ApolloModule, HttpLinkModule],
})
export class GraphqlModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    const http = httpLink.create({ uri: environment.apiUrl });

    const auth = setContext((_, { headers }) => {
      const token = environment.tempToken;
      if (!token) {
        return {};
      } else {
        return {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      }
    });

    apollo.create({
      link: auth.concat(http),
      cache: new InMemoryCache(),
    });
  }
}
