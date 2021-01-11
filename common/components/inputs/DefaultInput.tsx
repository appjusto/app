import React, { ReactNode, useCallback, useRef } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { borders, colors, texts } from '../../styles';
import PaddedView from '../containers/PaddedView';

export interface DefaultInputProps extends TextInputProps {
  title?: string;
  children?: ReactNode;
}

export default React.forwardRef(
  ({ title, children, style: externalStyle, ...props }: DefaultInputProps, externalRef) => {
    const internalRef = useRef<TextInput>(null);
    const ref = (externalRef as React.RefObject<TextInput>) || internalRef;
    const focus = useCallback(() => {
      if (!ref.current) return null;
      // if (!ref.current.isFocused()) {
      ref.current.focus();
      // }
    }, [ref.current]);
    return (
      <PaddedView
        half
        style={[
          {
            ...borders.default,
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          externalStyle,
        ]}
      >
        <View style={{ flex: 1 }}>
          {title && (
            <TouchableWithoutFeedback onPress={focus}>
              <Text
                style={{
                  ...texts.small,
                  color: colors.darkGreen,
                  width: '100%',
                }}
              >
                {title}
              </Text>
            </TouchableWithoutFeedback>
          )}
          <TextInput
            ref={ref}
            style={{
              ...texts.medium,
              color: colors.darkGrey,

              width: '100%',
            }}
            {...props}
          />
        </View>
        {children}
      </PaddedView>
    );
  }
);
