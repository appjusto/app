import { isEmpty } from 'lodash';
import React from 'react';
import { Keyboard, TextInput, View, ViewProps } from 'react-native';
import { DigitInput } from './DigitInput';
import { useRefs } from './useRefs';

interface Props extends ViewProps {
  value: string;
  onChange: (text: string) => void;
  length?: number;
}

export const CodeInput = ({ value, onChange, length = 3, style, ...props }: Props) => {
  // state
  const values = value.split('');
  // refs
  const refs = useRefs<TextInput>().slice(0, length);
  // UI handlers
  const updateValues = (
    char: string,
    index: number,
    nextInputRef?: React.RefObject<TextInput>,
    previousInputRef?: React.RefObject<TextInput>
  ) => {
    console.log('updateValues', char, index);
    onChange([...values.slice(0, index), char, ...values.slice(index + 1)].join(''));
    if (char) {
      if (nextInputRef?.current) nextInputRef.current.focus();
      else Keyboard.dismiss();
    } else if (previousInputRef?.current) {
      previousInputRef.current.focus();
    } else {
      Keyboard.dismiss();
    }
  };
  React.useEffect(() => {
    refs.find(() => true)?.current?.focus();
  }, []);
  // UI
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: 60,
        },
        style,
      ]}
      {...props}
    >
      {refs.map((ref, index) => (
        <View style={{ flex: 1, flexDirection: 'row' }} key={`input-${index}`}>
          {index > 0 ? <View style={{ flex: 0.1 }} /> : null}
          <DigitInput
            ref={ref}
            value={values[index]}
            blurOnSubmit={false}
            returnKeyType={index + 1 === refs.length ? 'done' : 'next'}
            onChangeText={(text) => {
              console.log(text);
              if (isEmpty(text)) updateValues(text, index, refs[index + 1], refs[index - 1]);
              else {
                text.split('').forEach((char, i) => {
                  const ii = index + i;
                  updateValues(char, ii, refs[ii + 1], refs[ii - 1]);
                });
              }
            }}
            onSubmitEditing={() => {
              if (index + 1 < refs.length) refs[index + 1]?.current?.focus();
              else Keyboard.dismiss();
            }}
            importantForAutofill="no"
            // maxLength={1}
          />
        </View>
      ))}
    </View>
  );
};
