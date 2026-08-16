
import React from 'react';
import EmptyState from '../../components/EmptyState';

export default function ApiErrorScreen({ goBack }) {
  return (
    <EmptyState
      icon="!"
      tone="error"
      title="Something went wrong"
      subtitle="Please try again."
      buttonLabel="Retry"
      onButtonPress={goBack}
    />
  );
}
