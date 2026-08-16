
import React from 'react';
import EmptyState from '../../components/EmptyState';

export default function BinderCompleteScreen({ navigate }) {
  return (
    <EmptyState
      icon="✓"
      tone="success"
      title="Binder Complete"
      subtitle="Binder complete. Great work!"
      buttonLabel="View Binder"
      onButtonPress={() => navigate('BinderDetail')}
    />
  );
}
