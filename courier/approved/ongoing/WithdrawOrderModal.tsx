import React from 'react';
import { Modal, Text, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import { colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

export const WithdrawOrderModal = ({ ...props }) => {
  return (
    <Modal transparent {...props}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}
      >
        <View
          style={{
            marginHorizontal: padding * 2,
            backgroundColor: colors.white,
            padding: padding * 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ ...texts.x2l }}>{t('Retire o pedido')}</Text>
          <Text style={{ ...texts.sm, color: colors.grey700 }}>
            {t('Mostre essa tela para o resturante')}
          </Text>
          <Text style={{ marginTop: 24, ...texts.xl, color: colors.grey700 }}>
            {t('Pedido Nº')}
          </Text>
          <DefaultButton title={t('Recebi o pedido')} onPress={() => null} />
        </View>
      </View>
    </Modal>
  );
};
