import React, { ReactNode, useRef, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { borders, texts, colors } from './styles';

export interface Props extends TextInputProps {
  title: string;
  children?: ReactNode;
}

export default React.forwardRef(
  ({ title, children, style: externalStyle, ...props }: Props, externalRef) => {
    const internalRef = useRef<TextInput>(null);
    const ref = (externalRef as React.RefObject<TextInput>) || internalRef;
    const focus = useCallback(() => {
      if (!ref.current) return null;
      // if (!ref.current.isFocused()) {
      ref.current.focus();
      // }
    }, [ref.current]);
    return (
      <View style={[styles.container, externalStyle]}>
        <View style={{ width: '100%' }}>
          <TouchableWithoutFeedback onPress={focus}>
            <Text style={styles.label}>{title}</Text>
          </TouchableWithoutFeedback>
          <TextInput ref={ref} style={styles.input} {...props} />
        </View>
        {children}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    ...borders.default,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    // ...borders.default,
  },
  label: {
    ...texts.small,
    color: colors.darkGreen,
    paddingVertical: 2,
    width: '100%',
    // ...borders.default,
  },
  input: {
    ...texts.medium,
    color: colors.darkGrey,
    width: '100%',
    // ...borders.default,
  },
});
