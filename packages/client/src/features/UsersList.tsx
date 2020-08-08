import React from 'react';
import { gql } from '8base-react-sdk';
import { useApolloClient } from 'react-apollo';

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

type UsersListState = {
  state: { kind: 'initial' } | { kind: 'loading' } | { kind: 'error'; error: any } | { kind: 'users'; users: any };
  effect: 'load-users' | null;
};

type UsersListActions =
  | { kind: 'load-users' }
  | { kind: 'set-error'; error: any }
  | { kind: 'clean-effect' }
  | { kind: 'set-loaded'; users: any[] };

function userListReducer(state: UsersListState, action: UsersListActions): UsersListState {
  switch (action.kind) {
    case 'load-users':
      return { state: { kind: 'loading' }, effect: 'load-users' };
    case 'clean-effect':
      return { ...state, effect: null };
    case 'set-loaded':
      return { ...state, state: { kind: 'users', users: action.users } };
    case 'set-error':
      return { ...state, state: { kind: 'error', error: action.error } };
    default:
      return state;
  }
}

const userListInitialState: UsersListState = {
  state: { kind: 'initial' },
  effect: null,
};

export default function UsersList() {
  const [context, send] = React.useReducer(userListReducer, userListInitialState);
  const client = useApolloClient();

  React.useEffect(
    function effectExec() {
      switch (context.effect) {
        case 'load-users': {
          /**
           * Feels a little bit more reliable, since client is a single-instance (or at least should be)
           */
          Promise.resolve(() => send({ kind: 'clean-effect' }))
            .then(() => client.query({ query: USERS_QUERY }))
            .then(
              function onSuccess({ data }) {
                send({ kind: 'set-loaded', users: data?.usersList || [] });
              },
              function onError(error) {
                send({ kind: 'set-error', error });
              },
            );
          break;
        }
      }
    },
    [context.effect, client],
  );

  switch (context.state.kind) {
    case 'loading': {
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

    case 'error': {
      return (
        <header>
          <h2>Users cannot be loaded!</h2>
          <code>
            <pre>{JSON.stringify(context.state.error, null, 2)}</pre>
          </code>
        </header>
      );
    }

    case 'users': {
      return (
        <div className="col">
          {context.state.users.items
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
      return <button onClick={() => send({ kind: 'load-users' })}>Load</button>;
  }
}
