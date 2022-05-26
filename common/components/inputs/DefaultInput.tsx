import { isEmpty } from 'lodash';
import React, { ReactNode, useCallback, useRef } from 'react';
import { Text, TextInput, TextInputProps, TouchableWithoutFeedback, View } from 'react-native';
import { borders, colors, texts } from '../../styles';
import PaddedView from '../containers/PaddedView';

export interface DefaultInputProps extends TextInputProps {
  title?: string;
  children?: ReactNode;
  errorMessage?: string;
}

export default React.forwardRef(
  (
    { title, children, editable = true, style, errorMessage, ...props }: DefaultInputProps,
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
    // UI
    return (
      <View style={style}>
        <PaddedView
          half
          style={[
            {
              ...borders.default,
              backgroundColor: 'white',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              alignContent: 'center',
              borderColor: isEmpty(errorMessage) ? borders.default.borderColor : colors.red,
            },
          ]}
        >
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              {!isEmpty(title) ? (
                <TouchableWithoutFeedback onPress={focus}>
                  <Text
                    style={{
                      ...texts.xs,
                      color: editable ? colors.green600 : colors.grey700,
                      width: '100%',
                    }}
                  >
                    {title}
                  </Text>
                </TouchableWithoutFeedback>
              ) : null}
              <View>
                <View>
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
              </View>
            </View>
          </View>
          <View style={{ alignSelf: 'center' }}>{children}</View>
        </PaddedView>
        {!isEmpty(errorMessage) ? (
          <Text style={{ ...texts.xs, color: colors.red }}>{errorMessage}</Text>
        ) : null}
      </View>
    );
  }
);
