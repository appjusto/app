import { StyleSheet } from 'react-native';
import { colors } from './colors';

const base = {
  fontFamily: 'BarlowMedium',
  color: colors.black,
};

export const texts = StyleSheet.create({
  base: base,
  bold: {
    fontFamily: 'BarlowBold',
    color: colors.black,
  },
  x2s: {
    ...base,
    fontSize: 11,
  },
  ss: {
    ...base,
    fontSize: 12,
  },
  xs: {
    ...base,
    fontSize: 13,
  },
  sm: {
    ...base,
    fontSize: 15,
  },
  md: {
    ...base,
    fontSize: 16,
  },
  lg: {
    ...base,
    fontSize: 18,
  },
  xl: {
    ...base,
    fontSize: 20,
  },
  x2l: {
    ...base,
    fontSize: 24,
  },
  x3l: {
    ...base,
    fontSize: 28,
  },
  x4l: {
    ...base,
    fontSize: 36,
  },
  x40l: {
    ...base,
    fontSize: 40,
  },
  x5l: {
    ...base,
    fontSize: 48,
  },
  x6l: {
    ...base,
    fontSize: 64,
  },
});
