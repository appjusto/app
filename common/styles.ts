import { StyleSheet } from 'react-native';

export const colors = {
  white: '#FFFFFF',
  lightGrey: '#F2F6EA',
  grey: '#C8D7CB',
  darkGrey: '#697667',
  black: '#000000',
  ultraLightGreen: '#F2FFE8',
  lightGreen: '#B8E994',
  green: '#78E08F',
  darkGreen: '#4EA031',
  yellow: '#FFBE00',
  lightRed: '#FFF8F8',
  red: '#DC3545',
};

export const doublePadding = 16;
export const padding = 16;
export const halfPadding = padding / 2;

export const screens = StyleSheet.create({
  default: {
    flex: 1,
    backgroundColor: colors.white,
  },
  configScreen: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  padded: {
    flex: 1,
    backgroundColor: colors.white,
    padding,
  },
  lightGrey: {
    flex: 1,
    backgroundColor: colors.lightGrey,
    paddingHorizontal: padding,
  },
});

export const borders = StyleSheet.create({
  default: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 8,
    borderColor: colors.grey,
  },
  rounder: {
    borderRadius: 16,
  },
  thicker: {
    borderWidth: 2,
  },
});

export const texts = StyleSheet.create({
  tiny: {
    fontFamily: 'BarlowMedium',
    color: colors.black,
    fontSize: 11,
    lineHeight: 13,
  },
  small: {
    fontFamily: 'BarlowMedium',
    color: colors.black,
    fontSize: 13,
    lineHeight: 18,
  },
  default: {
    fontFamily: 'BarlowMedium',
    color: colors.black,
    fontSize: 15,
    lineHeight: 18,
  },
  medium: {
    fontFamily: 'BarlowMedium',
    color: colors.black,
    fontSize: 16,
    lineHeight: 19,
  },
  mediumToBig: {
    fontFamily: 'BarlowMedium',
    color: colors.black,
    fontSize: 20,
    lineHeight: 26,
  },
  big: {
    fontFamily: 'BarlowMedium',
    color: colors.black,
    fontSize: 24,
    lineHeight: 29,
  },
  huge: {
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
