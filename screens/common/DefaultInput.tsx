import React, { ReactNode, useRef, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { borders, texts, colors } from './styles';

export interface Props extends TextInputProps {
  title: string;
  children?: ReactNode;
}

export default ({ title, children, style: externalStyle, ...props }: Props) => {
  const inputRef = useRef<TextInput>();
  const focus = useCallback(() => {
    if (!inputRef.current) return null;
    if (!inputRef.current.isFocused()) {
      inputRef.current.focus();
    }
  }, [inputRef.current]);
  return (
    <TouchableWithoutFeedback onPress={focus}>
      <View style={[style.container, externalStyle]}>
        <View>
          <Text style={style.label}>{title}</Text>
          <TextInput ref={inputRef} style={style.input} {...props} />
        </View>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

const style = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    ...borders.default,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  label: {
    ...texts.small,
    color: colors.darkGreen,
    paddingVertical: 2,
  },
  input: {
    ...texts.medium,
    color: colors.darkGrey,
  },
});
