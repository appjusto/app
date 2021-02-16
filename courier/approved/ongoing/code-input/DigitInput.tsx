import React from 'react';
import { TextInputProps, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { borders, texts } from '../../../../common/styles';

interface Props extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const DigitInput = React.forwardRef(
  ({ value, onChangeText, ...props }: Props, externalRef) => {
    return (
      <View style={{ flex: 1, height: 60, ...borders.default, justifyContent: 'center' }}>
        <TextInput
          ref={externalRef ? (externalRef as React.RefObject<TextInput>) : null}
          style={[
            {
              ...texts.sm,
              fontSize: 36,
              lineHeight: 36,
              textAlign: 'center',
              height: 60,
            },
          ]}
          maxLength={1}
          keyboardType="number-pad"
          selectTextOnFocus
          value={value}
          onChangeText={onChangeText}
          {...props}
        />
      </View>
    );
  }
);
