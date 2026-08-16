
import React from 'react';
import EmptyState from '../../components/EmptyState';

export default function EmptyCollectionScreen({ navigate }) {
  return (
    <EmptyState
      icon="+"
      title="Start building your collection"
      buttonLabel="Add a card"
      onButtonPress={() => navigate('MyCollection')}
    />
  );
}
