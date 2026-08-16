
import React from 'react';
import EmptyState from '../../components/EmptyState';

export default function NoSearchResultsScreen({ navigate }) {
  return (
    <EmptyState
      icon="⌕"
      title="Try a different search term"
      buttonLabel="Clear Search"
      onButtonPress={() => navigate('Search')}
    />
  );
}
