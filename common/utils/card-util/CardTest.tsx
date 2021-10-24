import React from 'react';
import { Image, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { useContextCreditCardFancy } from './CreditCardFancyContex';
const iconGenericFlag = require('../../../assets/icons/credit-card-flag-generic.png');

const UselessTextInput = () => {
  const [text, onChangeText] = React.useState('');

  //const [number, onChangeNumber] = React.useState(null);
  const { getType, isAllowed, getFlagPNG } = useContextCreditCardFancy();
  const [image, setImage] = React.useState(iconGenericFlag);

  const teste = (test: any) => {
    onChangeText(test);
    //console.log(isAllowed(test));
    const type = getType(test);
    //console.log(isAllowed(type));
    const png = getFlagPNG(type);
    setImage(png);
    console.log(png);
  };
  return (
    <SafeAreaView>
      <TextInput style={styles.input} onChangeText={teste} value={text} keyboardType="numeric" />
      <Image source={image} />
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
