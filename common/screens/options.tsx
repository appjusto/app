import React from 'react';
import { BackButton } from '../components/views/BackButton';

export const defaultScreenOptions = {
  headerBackImage: () => <BackButton />,
  headerBackTitleVisible: false,
  headerStyle: {
    backgroundColor: 'white',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
};
