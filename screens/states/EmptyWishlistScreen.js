
import React from 'react';
import EmptyState from '../../components/EmptyState';

export default function EmptyWishlistScreen({ navigate }) {
  return (
    <EmptyState
      icon="♡"
      title="Add cards you're chasing"
      buttonLabel="Browse sets"
      onButtonPress={() => navigate('AllSets')}
    />
  );
}
