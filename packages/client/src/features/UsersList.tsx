import React from 'react';
import { gql } from '8base-react-sdk';
import { useLazyQuery } from 'react-apollo';

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
  state: 'initial' | 'loading' | 'error' | 'users';
  effect: 'load-users' | null;
};

type UsersListActions = 'load-users' | 'set-error' | 'clean-effect' | 'set-loaded';

function userListReducer(state: UsersListState, action: UsersListActions): UsersListState {
  switch (action) {
    case 'load-users':
      return { state: 'loading', effect: 'load-users' };
    case 'clean-effect':
      return { ...state, effect: null };
    case 'set-loaded':
      return { ...state, state: 'users' };
    case 'set-error':
      return { ...state, state: 'error' };
    default:
      return state;
  }
}

const userListInitialState: UsersListState = {
  state: 'initial',
  effect: null,
};

export default function UsersList() {
  const [context, send] = React.useReducer(userListReducer, userListInitialState);
  const [_getUsers, { loading, error, data }] = useLazyQuery(USERS_QUERY);

  // this is just making sure the damn thing is not recreated
  const getUsers = React.useCallback(_getUsers, []);

  React.useEffect(
    function effectExec() {
      switch (context.effect) {
        case 'load-users': {
          /**
           * Feels scary the callback will execute the effect again if recreated...
           * 
           * It kinda forces you to make context.effect into a mutable?
           * 
           * But then again you won't be able to rely on a mutable
           * when it comes to diffing/snapshoting states or history manipulation.
           * 
           * Also feels wonky and verbose.
           * 
           * And what if you actually want the callback to change at a certaing point?
           */
          getUsers();
          /**
           * This also feels scary because dispaches aren't instantanious.
           */
          send('clean-effect');
          break;
        }
      }
    },
    [context.effect, getUsers],
  );

  React.useEffect(
    function syncWithGqlState() {
      if (error) {
        send('set-error');
      } else if (loading === false) {
        data && send('set-loaded');
      }
    },
    [error, loading, data],
  );

  switch (context.state) {
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
      return <h2>Users cannot be loaded!</h2>;
    }

    case 'users': {
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
    }

    default:
      return <button onClick={() => send('load-users')}>Load</button>;
  }
}