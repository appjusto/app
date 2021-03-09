import React, { ReactNode, useCallback, useRef } from 'react';
import { Text, TextInput, TextInputProps, TouchableWithoutFeedback, View } from 'react-native';
import { borders, colors, texts } from '../../styles';
import PaddedView from '../containers/PaddedView';

export interface DefaultInputProps extends TextInputProps {
  title?: string;
  children?: ReactNode;
}

export default React.forwardRef(
  ({ title, children, editable = true, style, ...props }: DefaultInputProps, externalRef) => {
    const internalRef = useRef<TextInput>(null);
    const ref = (externalRef as React.RefObject<TextInput>) || internalRef;
    const focus = useCallback(() => {
      if (!ref.current) return null;
      // if (!ref.current.isFocused()) {
      ref.current.focus();
      // }
    }, [ref]);
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
          style,
        ]}
      >
        <View style={{ flex: 1 }}>
          {title && (
            <TouchableWithoutFeedback onPress={focus}>
              <Text
                style={{
                  ...texts.xs,
                  color: colors.green600,
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
              ...texts.md,
              color: editable ? colors.grey700 : colors.grey500,
              width: '100%',
            }}
            editable={editable}
            {...props}
          />
        </View>
        {children}
      </PaddedView>
    );
  }
);
