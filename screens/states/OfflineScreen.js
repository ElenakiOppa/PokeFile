
import React from 'react';
import EmptyState from '../../components/EmptyState';

export default function OfflineScreen({ goBack }) {
  return (
    <EmptyState
      icon="☁"
      title="You're offline"
      subtitle="Check your connection and try again."
      buttonLabel="Retry"
      onButtonPress={goBack}
    />
  );
}
