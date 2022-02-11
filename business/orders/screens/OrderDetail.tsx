import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DoubleHeader from '../../../common/components/texts/DoubleHeader';
import RoundedText from '../../../common/components/texts/RoundedText';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import { useSegmentScreen } from '../../../common/store/api/track';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';

export const OrderDetail = () => {
  // tracking
  useSegmentScreen('OrderDetail');
  return (
    <ScrollView
      style={{ ...screens.config, paddingTop: padding }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <DoubleHeader title={t('Pedido Nº 0001')} subtitle={t('Horário do pedido: 00h00m00s')} />
      <PaddedView>
        <RoundedText backgroundColor={colors.red} noBorder color={colors.white}>
          Pendente
        </RoundedText>
        <Text style={{ ...texts.md, marginTop: halfPadding }}>
          {t('Nome do cliente: ')}
          <Text style={texts.bold}>{t('Nome')}</Text>
        </Text>
        <Text style={{ ...texts.md }}>
          {t('Nº de pedidos no restaurante: ')}
          <Text style={texts.bold}>{t('1')}</Text>
        </Text>
        <View style={{ marginTop: halfPadding }}>
          <DefaultButton title={t('Abrir chat com o cliente')} secondary />
        </View>
      </PaddedView>
      <View style={{ marginTop: 24 }}>
        <SingleHeader title={t('Detalhes do pedido')} />
      </View>
      <PaddedView>
        <View>
          <Text style={{ ...texts.md, marginBottom: halfPadding }}>
            {t('Tempo de preparo: ')}
            <Text style={texts.bold}>{t('15 minutos')}</Text>
          </Text>
          {/* this button will open a modal for selecting cooking time */}
          <DefaultButton title={t('Alterar tempo de preparo')} secondary />
        </View>
        {/* add qtde. item valor/item "line" on top of OrderItem list here */}
        {/* add OrderItem list here */}
      </PaddedView>
      <SingleHeader title={t('Forma de pagamento')} />
      <PaddedView>
        <Text style={{ ...texts.md }}>
          {t('Total pago: ')}
          <Text style={texts.bold}>{t('R$ 0,00')}</Text>
        </Text>
        <Text style={{ ...texts.md, marginTop: 4 }}>
          {t('Método de pagamento: ')}
          <Text style={texts.bold}>{t('pagamento via app')}</Text>
        </Text>
      </PaddedView>
      <View style={{ marginTop: 24, flex: 1 }}>
        <SingleHeader title={t('Observações')} />
        <PaddedView>
          <Text style={{ ...texts.md, marginBottom: 40 }}>
            {t('Incluir CPF na nota, CPF: 000.000.000-00')}
          </Text>
          {/* this button will open a CancelOrderModal  */}
          <DefaultButton title={t('Cancelar pedido')} secondary />
        </PaddedView>
      </View>
      <View style={{ flex: 1 }} />
      <View
        style={{
          paddingVertical: halfPadding,
          paddingHorizontal: padding,
          borderTopColor: colors.grey500,
          borderTopWidth: 1,
        }}
      >
        <View style={{ width: '100%' }}>
          <DefaultButton title={t('Aceitar pedido')} />
        </View>
      </View>
    </ScrollView>
  );
};
