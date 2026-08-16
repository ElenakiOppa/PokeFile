
import React from 'react';
import EmptyState from '../../components/EmptyState';

export default function CardNotOwnedScreen({ navigate }) {
  return (
    <EmptyState
      icon="?"
      title="Not in Collection"
      subtitle="#015 — you don't own this card yet."
      buttonLabel="Add to Collection"
      onButtonPress={() => navigate('AddToCollection')}
    />
  );
}
