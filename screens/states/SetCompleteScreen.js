
import React from 'react';
import EmptyState from '../../components/EmptyState';

export default function SetCompleteScreen({ navigate }) {
  return (
    <EmptyState
      icon="✓"
      tone="success"
      title="Set Complete"
      subtitle="Congratulations! You completed this set."
      buttonLabel="View Set"
      onButtonPress={() => navigate('SetDetail')}
    />
  );
}
