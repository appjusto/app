import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const borderRadius1 = 8;
export const borderRadius2 = 24;
export const borderRadius3 = 32;

export const borders = StyleSheet.create({
  default: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: borderRadius1,
    borderColor: colors.grey700,
  },
  round: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: borderRadius2,
    borderColor: colors.grey700,
  },
  rounder: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: borderRadius3,
    borderColor: colors.grey700,
  },
});
