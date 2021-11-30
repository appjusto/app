import React, { ReactNode, useCallback, useRef } from 'react';
import { Text, TextInput, TextInputProps, TouchableWithoutFeedback, View } from 'react-native';
import { borders, colors, texts } from '../../styles';
import PaddedView from '../containers/PaddedView';

export interface DefaultInputProps extends TextInputProps {
  title?: string;
  children?: ReactNode;
  trailing?: ReactNode;
  errorMessage?: string;
}

export default React.forwardRef(
  (
    {
      title,
      children,
      editable = true,
      style,
      trailing,
      errorMessage,
      ...props
    }: DefaultInputProps,
    externalRef
  ) => {
    const internalRef = useRef<TextInput>(null);
    const ref = (externalRef as React.RefObject<TextInput>) || internalRef;
    const focus = useCallback(() => {
      if (!ref.current) return null;
      // if (!ref.current.isFocused()) {
      ref.current.focus();
      // }
    }, [ref]);
    return (
      <View style={[{ flexDirection: 'column' }, style]}>
        <PaddedView
          half
          style={[
            {
              ...borders.default,
              backgroundColor: 'white',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderColor: errorMessage ? colors.red : borders.default.borderColor,
            },
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
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
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
              {trailing}
            </View>
          </View>
          {children}
        </PaddedView>
        {!!errorMessage && <Text style={{ ...texts.xs, color: colors.red }}>{errorMessage}</Text>}
      </View>
    );
  }
);
