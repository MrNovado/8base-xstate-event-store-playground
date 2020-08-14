import React from 'react';
import { gql } from '8base-react-sdk';
import { useApolloClient } from 'react-apollo';
import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

const OFFERS_QUERY = gql`
  query OffersList {
    offersList {
      count
      items {
        id
        name
        status
        startsIn
        startEffects {
          count
          items {
            id
            type
            status
          }
        }
        endsIn
        endEffects {
          count
          items {
            id
            type
            status
          }
        }
        createdAt
        updatedAt
        createdBy {
          id
          firstName
        }
      }
    }
  }
`;

const offersListMachine = Machine({
  context: { error: null, offers: { items: [] } },
  initial: 'initial',
  states: {
    initial: {
      on: {
        'load-offers': 'loading',
      },
    },
    loading: {
      invoke: {
        src: 'loadOffers',
        onDone: {
          target: 'showing-offers',
          actions: 'saveOffers',
        },
        onError: {
          target: 'error',
          actions: 'saveError',
        },
      },
    },
    'showing-offers': {
      id: 'showing-offers',
      context: { selectedOfferId: null },
      initial: 'default',
      states: {
        default: {
          on: {
            'select-offer': {
              target: 'offer-selected',
              actions: 'selectOffer',
            },
          },
        },
        'offer-selected': {
          on: {
            'create-offer': 'creatingOffer',
            'update-offer': 'updatingOffer',
          },
        },
        creatingOffer: {
          on: {
            cancel: '#showing-offers',
          },
        },
        updatingOffer: {
          on: {
            cancel: '#showing-offers',
          },
        },
      },
    },
    error: { type: 'final' },
  },
});

const creatingOfferMachine = Machine({
  context: {},
  initial: 'editing',
  states: {
    editing: {},
    submitting: {},
  },
  on: {
    cancel: 'cancel',
  },
});

function CreateOfferForm() {
  return null;
}

const updatingOfferMachine = Machine({
  context: {},
  initial: 'editing',
  states: {
    editing: {},
    submitting: {},
  },
  on: {
    cancel: 'cancel',
  },
});

function UpdateOfferForm() {
  return null;
}

export default function OffersList() {
  return null;
}
