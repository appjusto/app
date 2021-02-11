import React from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import { DigitInput } from './DigitInput';

interface Props {
  value: string;
  onChange: (text: string) => void;
}

export const CodeInput = ({ value, onChange }: Props) => {
  // state
  const values = [value.charAt(0), value.charAt(1), value.charAt(2)];
  // refs
  const secondInputRef = React.useRef<TextInput>(null);
  const thirdInputRef = React.useRef<TextInput>(null);
  // UI handlers
  const updateValues = (char: string, index: number, nextInputRef?: React.RefObject<TextInput>) => {
    onChange([...values.slice(0, index), char, ...values.slice(index + 1)].join(''));
    if (nextInputRef?.current) {
      // avoid jumping to next input if users delete
      if (char) nextInputRef.current.focus();
    } else {
      Keyboard.dismiss();
    }
  };
  // UI
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 60,
      }}
    >
      <DigitInput
        value={values[0]}
        blurOnSubmit={false}
        returnKeyType="next"
        onChangeText={(char) => updateValues(char, 0, secondInputRef)}
        onSubmitEditing={() => secondInputRef.current?.focus()}
      />
      <View style={{ flex: 0.1 }} />
      <DigitInput
        ref={secondInputRef}
        value={values[1]}
        blurOnSubmit={false}
        returnKeyType="next"
        onChangeText={(char) => updateValues(char, 1, thirdInputRef)}
        onSubmitEditing={() => thirdInputRef.current?.focus()}
      />
      <View style={{ flex: 0.1 }} />
      <DigitInput
        ref={thirdInputRef}
        value={values[2]}
        returnKeyType="done"
        onChangeText={(char) => updateValues(char, 2)}
      />
    </View>
  );
};
