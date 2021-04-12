import React from 'react';
import { Platform } from 'react-native';
import { halfPadding } from '../../styles';
import ArrowBox from './ArrowBox';

export const BackButton = () => (
  <ArrowBox
    style={{ marginLeft: Platform.OS === 'ios' ? halfPadding : 0, borderWidth: 0 }}
    flipped
  />
);
