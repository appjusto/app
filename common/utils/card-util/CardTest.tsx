import { toNumber } from 'lodash';
import React, { useCallback } from 'react';
import { Image, SafeAreaView, StyleSheet } from 'react-native';
import { t } from '../../../strings';
import { cardFormatter, cardMask } from '../../components/inputs/pattern-input/formatters';
import { numbersOnlyParser } from '../../components/inputs/pattern-input/parsers';
import PatternInput from '../../components/inputs/PatternInput';
import { useContextCreditCardFancy } from './CreditCardFancyContex';

const iconGenericFlag = require('../../../assets/icons/credit-card-flag-generic.png');

const UselessTextInput = () => {
  //const [number, onChangeNumber] = React.useState(null);

  const [number, setNumber] = React.useState('');
  const { getType, isAllowed, getFlagPNG } = useContextCreditCardFancy();
  const [image, setImage] = React.useState(iconGenericFlag);

  const onChangeNumber = useCallback(
    (text: any) => {
      if (isNaN(toNumber(text))) return;

      setNumber(text);

      const type = getType(text);
      const png = getFlagPNG(type);
      setImage(png);
      console.log(png);
    },
    [setNumber, getType, getFlagPNG]
  );

  return (
    <SafeAreaView>
      <PatternInput
        title={t('Número do cartão')}
        value={number}
        placeholder={t('0000 0000 0000 0000')}
        mask={cardMask}
        parser={numbersOnlyParser}
        formatter={cardFormatter}
        keyboardType="number-pad"
        textContentType="creditCardNumber"
        autoCompleteType="cc-number"
        returnKeyType="next"
        blurOnSubmit={false}
        onChangeText={onChangeNumber}
        trailing={<Image source={image} />}
      // onSubmitEditing={() => expirationMonthRef.current?.focus()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default UselessTextInput;
