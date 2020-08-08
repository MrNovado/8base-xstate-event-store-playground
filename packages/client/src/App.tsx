import React from 'react';
import { AppProvider, gql } from '8base-react-sdk';
import { Query } from 'react-apollo';

import './App.css';

const { REACT_APP_WORKSPACE_URL } = process.env;

const USERS_QUERY = gql`
  query UserList {
    usersList {
      items {
        id
        firstName
        lastName
        email
        status
        origin
        is8base
        roles {
          items {
            id
            name
          }
        }
      }
    }
  }
`;

function App() {
  return (
    <div className="App">
      <AppProvider
        uri={REACT_APP_WORKSPACE_URL as string}
        onRequestSuccess={console.info}
        onRequestError={console.error}
      >
        {({ loading, error }) => {
          if (loading) {
            return (
              <section>
                <h1>Connecting to 8base...</h1>
              </section>
            );
          }

          if (error) {
            return (
              <section>
                <h1>Cannot connect to 8base!</h1>
              </section>
            );
          }

          return (
            <article>
              <header>
                <h1>Users List</h1>
              </header>
              <section>
                <Query query={USERS_QUERY}>
                  {({ loading, error, data }: { loading: boolean; error?: any; data: any }) => {
                    if (loading) {
                      return (
                        <header className="loading">
                          <h2>Loading users...</h2>
                          <>
                            {[{ id: 'loading', firstName: 'loading' }].map((it: any) => (
                              <code key={it.id}>
                                <pre>{JSON.stringify(it, null, 2)}</pre>
                              </code>
                            ))}
                          </>
                        </header>
                      );
                    }

                    if (error) {
                      return <h2>Users cannot be loaded!</h2>;
                    }

                    return (
                      <div className="col">
                        {data.usersList.items
                          .concat([
                            { id: 'placeholder1', firstName: 'placeholder' },
                            { id: 'placeholder2', firstName: 'placeholder' },
                            { id: 'placeholder3', firstName: 'placeholder' },
                            { id: 'placeholder4', firstName: 'placeholder' },
                            { id: 'placeholder5', firstName: 'placeholder' },
                            { id: 'placeholder6', firstName: 'placeholder' },
                          ])
                          .map((it: any) => (
                            <code key={it.id}>
                              <pre>{JSON.stringify(it, null, 2)}</pre>
                            </code>
                          ))}
                      </div>
                    );
                  }}
                </Query>
              </section>
            </article>
          );
        }}
      </AppProvider>
    </div>
  );
}

export default App;
