import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

import { t } from '../../../strings';
import DefaultButton from '../../common/DefaultButton';
import { borders, texts, colors } from '../../common/styles';

export default function ({ name, participants, description, onButtonPress }) {
  const [isActive, setIsActive] = useState(false);
  const touchHandler = () => setIsActive(!isActive);
  return (
    <TouchableWithoutFeedback onPress={touchHandler}>
      <View style={isActive ? styles.activeBox : styles.box}>
        <View>
          <Text style={{ ...texts.default }}>{name}</Text>
          <Text style={{ ...texts.small, marginTop: 4, color: colors.darkGreen }}>
            {participants}
          </Text>
          <Text style={{ ...texts.small, marginTop: 12, height: 54, color: colors.darkGrey }}>
            {description}
          </Text>
          <View style={styles.fareContainer}>
            <Text style={{ ...texts.small }}>{t('R$ 6,00 valor mínimo + R$ 1,00 por km')}</Text>
          </View>
        </View>
        <DefaultButton
          style={{ marginTop: 16 }}
          title={t('Confirmar')}
          onPress={onButtonPress}
          disabled={!isActive}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  box: {
    width: '100%',
    height: 243,
    ...borders.default,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.white,
  },
  activeBox: {
    width: '100%',
    height: 243,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 8,
    borderColor: colors.green,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.white,
  },
  fareContainer: {
    ...borders.default,
    borderColor: colors.black,
    borderRadius: 32,
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 26,
    alignItems: 'center',
    width: 240,
    marginTop: 16,
  },
});
