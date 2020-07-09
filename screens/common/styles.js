import { StyleSheet } from 'react-native';

export const colors = {
  white: '#FFFFFF',
  black: '#000000',
  lightGreen: '#B8E994',
  green: '#78E08F',
  darkGreen: '#63B745',
  lightGrey: '#F2F7EA',
  grey: '#C8D7CB',
  darkGrey: '#697667',
}

export const screens = StyleSheet.create({
  default: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export const borders = StyleSheet.create({
  default: {
    borderRadius: 8,
    borderStyle: 'solid',
    borderColor: colors.grey,
    borderWidth: 1,
  },
});

export const texts = StyleSheet.create({
  default: {
    fontFamily: 'BarlowMedium',
  }
});

export const flex = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});



