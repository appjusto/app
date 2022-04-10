import React from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import DefaultInput, { DefaultInputProps } from './DefaultInput';

export interface PatternInputProps extends DefaultInputProps {
  parser?: (value: string) => string;
  formatter?: (value: string | undefined) => string;
  // onValueChange: (value: string) => void;
  mask?: string;
}

export default React.forwardRef(
  (
    {
      parser,
      formatter,
      mask,
      value,
      placeholder: unfocusedPlaceholder,
      // onValueChange,
      onBlur,
      onChangeText,
      onFocus,
      errorMessage,
      ...props
    }: PatternInputProps,
    externalRef
  ) => {
    // state
    const [placeholder, setPlaceholder] = React.useState(unfocusedPlaceholder);
    const formattedValue = value ? (formatter ? formatter(String(value)) : value) : value;
    const [error, setError] = React.useState<string>();
    // handlers
    const onChangeHandler = (text: string) => {
      if (onChangeText) onChangeText(parser ? parser(text) : text);
    };
    const onFocusHandler = (ev: NativeSyntheticEvent<TextInputFocusEventData>) => {
      if (mask) setPlaceholder(mask);
      setError('');
      if (onFocus) onFocus(ev);
    };
    const onBlurHandler = (ev: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setPlaceholder(unfocusedPlaceholder);
      setError(errorMessage);
      if (onBlur) onBlur(ev);
    };
    // UI
    return (
      <DefaultInput
        value={formattedValue}
        placeholder={placeholder}
        onChangeText={onChangeHandler}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        maxLength={mask ? mask.length : undefined}
        errorMessage={error}
        ref={externalRef}
        {...props}
      />
    );
  }
);
