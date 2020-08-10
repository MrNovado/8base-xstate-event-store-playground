import React from 'react';
import { gql } from '8base-react-sdk';
import { useApolloClient } from 'react-apollo';
import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

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

type Schema = {
  states: {
    initial: {};
    loading: {};
    error: {};
    users: {};
  };
};

type Context = {
  error: any | null;
  users: { items: any[] };
};

type Events = { type: 'load-users' };

const usersListMachine = Machine<Context, Schema, Events>(
  {
    context: { error: null, users: { items: [] } },
    initial: 'initial',
    states: {
      initial: {
        on: {
          'load-users': 'loading',
        },
      },
      loading: {
        invoke: {
          src: 'loadUsers',
          onDone: {
            target: 'users',
            actions: 'saveUsers',
          },
          onError: {
            target: 'error',
            actions: 'saveError',
          },
        },
      },
      users: { type: 'final' },
      error: { type: 'final' },
    },
  },
  {
    actions: {
      saveUsers: assign((context, event: any) => ({ ...context, users: event.data })),
      saveError: assign((context, event: any) => ({ ...context, error: event.data })),
    },
    services: {
      loadUsers: () => Promise.reject('loadUsers is not defined'),
    },
  },
);

export default function UsersList() {
  const client = useApolloClient();

  /**
   * ========= BUSINESS =======================================================
   */

  const [state, send] = useMachine(usersListMachine, {
    services: {
      loadUsers: () =>
        Promise.resolve()
          .then(() => client.query({ query: USERS_QUERY, fetchPolicy: 'no-cache' }))
          .then(({ data }) => data?.usersList || []),
    },
  });

  /**
   * ========= PRESENTATION ===================================================
   */

  switch (true) {
    case state.matches('loading'): {
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

    case state.matches('error'): {
      return (
        <header>
          <h2>Users cannot be loaded!</h2>
          <code>
            <pre>{JSON.stringify(state.context.error, null, 2)}</pre>
          </code>
        </header>
      );
    }

    case state.matches('users'): {
      return (
        <div className="col">
          {state.context.users.items
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
    }

    default:
      return <button onClick={() => send({ type: 'load-users' })}>Load (xstate-based)</button>;
  }
}
