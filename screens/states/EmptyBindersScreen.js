
import React from 'react';
import EmptyState from '../../components/EmptyState';

export default function EmptyBindersScreen({ navigate }) {
  return (
    <EmptyState
      icon="▢"
      title="Your collection needs somewhere to live"
      buttonLabel="Create a binder"
      onButtonPress={() => navigate('CoverDesigner')}
    />
  );
}
