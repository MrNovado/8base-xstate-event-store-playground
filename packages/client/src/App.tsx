import React from 'react';
import { AppProvider } from '8base-react-sdk';

import UsersList from './features/UsersList';
import './App.css';

const { REACT_APP_WORKSPACE_URL } = process.env;

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
              <section className="loading">
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
                <UsersList />
              </section>
            </article>
          );
        }}
      </AppProvider>
    </div>
  );
}

export default App;
