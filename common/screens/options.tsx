import React from 'react';
import { BackButton } from '../components/views/BackButton';
import { colors } from '../styles';

export const defaultScreenOptions = {
  headerBackImage: () => <BackButton />,
  headerBackTitleVisible: false,
  headerStyle: {
    backgroundColor: colors.white,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
};
