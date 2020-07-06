import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function RegularButton({ children, isGreen }) {
  return (
    <TouchableOpacity>
      <View
        style={{
          ...styles.buttonContainer,
          backgroundColor: isGreen ? '#78E08F' : '#697667',
        }}
      >
        <Text style={{ ...styles.text, color: isGreen ? 'black' : 'white' }}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 14.5,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', //the container shrinks to the size of its content
  },
  text: {
    fontSize: 16,
    lineHeight: 19,
    height: 19,
  },
});
