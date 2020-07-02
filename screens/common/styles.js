import { StyleSheet } from 'react-native';

export const colors = {
  white: '#FFFFFF',
  black: '#000000',
  lightGreen: '#B8E994',
  green: '#78E08F',
  darkGreen: '#63B745',
}

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

