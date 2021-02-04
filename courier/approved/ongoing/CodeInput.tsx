import React from 'react';
import { TextInputProps, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { borders, texts } from '../../../common/styles';

export const CodeInput = ({ ...props }: TextInputProps) => {
  // const [firstDigit, setFirstDigit] = React.useState<number>(0);

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
      <TextInput
        maxLength={1}
        keyboardType="number-pad"
        returnKeyType="next"
        {...props}
        style={[
          { ...texts.default, fontSize: 36 },
          {
            ...borders.default,
            width: '30%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      />
      <TextInput
        maxLength={1}
        keyboardType="number-pad"
        returnKeyType="next"
        {...props}
        style={[
          { ...texts.default, fontSize: 36 },
          {
            ...borders.default,
            width: '30%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      />
      <TextInput
        maxLength={1}
        keyboardType="number-pad"
        returnKeyType="done"
        {...props}
        style={[
          { ...texts.default, fontSize: 36 },
          {
            ...borders.default,
            width: '30%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      />
    </View>
  );
};
