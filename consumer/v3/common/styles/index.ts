import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { padding4 } from './padding';

export const screens = StyleSheet.create({
  default: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: padding4,
  },
});
