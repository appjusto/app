import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const borderRadius1 = 8;
export const borderRadius2 = 24;

export const borders = StyleSheet.create({
  default: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: borderRadius1,
    borderColor: colors.grey700,
  },
});
