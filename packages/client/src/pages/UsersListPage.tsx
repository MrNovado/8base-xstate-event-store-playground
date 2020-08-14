import React from 'react';
import UsersList from '../features/UsersList';
import UsersListXstate from '../features/UsersList-X';

export default function UsersListPage() {
  return (
    <article>
      <header>
        <h1>Users List</h1>
      </header>
      <section className="col-2">
        <UsersList />
        <UsersListXstate />
      </section>
    </article>
  );
}
