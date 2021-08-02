import { StackNavigationOptions } from '@react-navigation/stack';
import React from 'react';
import { Platform } from 'react-native';
import { BackButton } from '../components/views/BackButton';
import { colors, padding, texts } from '../styles';

export const defaultScreenOptions: StackNavigationOptions = {
  headerBackImage: () => <BackButton />,
  headerBackTitleVisible: false,
  headerTitleStyle: {
    ...texts.md,
    paddingHorizontal: padding,
    fontSize: Platform.OS === 'android' ? 18 : 16,
  },
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: colors.white,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
};
