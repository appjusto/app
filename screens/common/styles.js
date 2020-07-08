import { StyleSheet } from 'react-native';

export const colors = {
  white: '#FFFFFF',
  black: '#000000',
  lightGreen: '#B8E994',
  green: '#78E08F',
  darkGreen: '#63B745',
  grey: '#C8D7CB',
  darkGrey: '#697667',
}

export const borders = StyleSheet.create({
  default: {
    borderRadius: 8,
    borderStyle: 'solid',
    borderColor: colors.grey,
    borderWidth: 1,
  }
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

export const decoration = StyleSheet.create({
  border: {
    borderWidth: 2,
    borderColor: '#ff0000',
  }
});

