import Constants from 'expo-constants';
import { StyleSheet } from 'react-native';

export const colors = {
  white: '#FFFFFF',
  grey50: '#F2F6EA',
  grey500: '#C8D7CB',
  grey700: '#697667',
  black: '#000000',
  green50: '#F2FFE8',
  green100: '#B8E994',
  green500: '#78E08F',
  green600: '#4EA031',
  yellow: '#FFE493',
  darkYellow: '#FFBE00',
  lightRed: '#FFF8F8',
  red: '#DC3545',
};

export const doublePadding = 32;
export const padding = 16;
export const halfPadding = padding / 2;

export const screens = StyleSheet.create({
  default: {
    flex: 1,
    backgroundColor: colors.white,
  },
  config: {
    flex: 1,
    backgroundColor: colors.grey50,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headless: {
    marginTop: Constants.statusBarHeight,
  },
  lightGrey: {
    flex: 1,
    backgroundColor: colors.grey50,
    paddingHorizontal: padding,
  },
});

export const borders = StyleSheet.create({
  default: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 8,
    borderColor: colors.grey500,
  },
  squared: {
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderRadius: 4,
    borderColor: colors.black,
  },
  rounder: {
    borderRadius: 16,
  },
  thicker: {
    borderWidth: 2,
  },
});

export const texts = StyleSheet.create({
  xxs: {
    fontFamily: 'BarlowMedium',
    color: colors.black,
    fontSize: 11,
    lineHeight: 13,
  },
  xs: {
    fontFamily: 'BarlowMedium',
    color: colors.black,
    fontSize: 13,
    lineHeight: 18,
  },
  sm: {
    fontFamily: 'BarlowMedium',
    color: colors.black,
    fontSize: 15,
    lineHeight: 21,
  },
  md: {
    fontFamily: 'BarlowMedium',
    color: colors.black,
    fontSize: 16,
    lineHeight: 22,
  },
  xl: {
    fontFamily: 'BarlowMedium',
    color: colors.black,
    fontSize: 20,
    lineHeight: 26,
  },
  xxl: {
    fontFamily: 'BarlowMedium',
    color: colors.black,
    fontSize: 24,
    lineHeight: 30,
  },
  xxxxl: {
    fontFamily: 'BarlowMedium',
    color: colors.black,
    fontSize: 40,
    lineHeight: 48,
  },
  bold: {
    fontFamily: 'BarlowBold',
  },
});

export const flex = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
