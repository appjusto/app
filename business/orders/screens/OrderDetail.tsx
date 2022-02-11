import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DoubleHeader from '../../../common/components/texts/DoubleHeader';
import RoundedText from '../../../common/components/texts/RoundedText';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import { UnloggedParamList } from '../../../common/screens/unlogged/types';
import { useSegmentScreen } from '../../../common/store/api/track';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { CancelOrderModal } from '../components/CancelOrderModal';
// TODO: add the correct screenNavigationProp
type ScreenNavigationProp = StackNavigationProp<UnloggedParamList, 'OrderDetail'>;
type ScreenRouteProp = RouteProp<UnloggedParamList, 'OrderDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OrderDetail = () => {
  // state
  const [modalVisible, setModalVisible] = React.useState(false);
  // tracking
  useSegmentScreen('OrderDetail');
  return (
    <View style={{ ...screens.config }}>
      <ScrollView
        style={{ ...screens.config }}
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
          <View style={{ marginTop: halfPadding, width: '60%' }}>
            <DefaultButton title={t('Abrir chat com o cliente')} secondary />
          </View>
        </PaddedView>
        <View style={{ marginTop: padding }}>
          <SingleHeader title={t('Detalhes do pedido')} />
        </View>
        <View style={{ paddingTop: halfPadding, paddingHorizontal: padding, paddingBottom: 32 }}>
          <View>
            <Text style={{ ...texts.md, marginBottom: halfPadding }}>
              {t('Tempo de preparo: ')}
              <Text style={texts.bold}>{t('15 minutos')}</Text>
            </Text>
            {/* this button will open a modal for selecting cooking time */}
            <View style={{ width: '60%' }}>
              <DefaultButton title={t('Alterar tempo de preparo')} secondary />
            </View>
          </View>
          {/* add qtde. item valor/item "line" on top of OrderItem list here */}
          {/* add OrderItem list here */}
        </View>
        <SingleHeader title={t('Forma de pagamento')} />
        <View
          style={{ paddingTop: halfPadding, paddingHorizontal: padding, paddingBottom: padding }}
        >
          <Text style={{ ...texts.md }}>
            {t('Total pago: ')}
            <Text style={texts.bold}>{t('R$ 0,00')}</Text>
          </Text>
          <Text style={{ ...texts.md, marginTop: 4 }}>
            {t('Método de pagamento: ')}
            <Text style={texts.bold}>{t('pagamento via app')}</Text>
          </Text>
        </View>
        <View style={{ marginTop: padding, flex: 1 }}>
          <SingleHeader title={t('Observações')} />
          <View
            style={{ paddingTop: halfPadding, paddingHorizontal: padding, paddingBottom: padding }}
          >
            <Text style={{ ...texts.md, marginBottom: 40 }}>
              {t('Incluir CPF na nota, CPF: 000.000.000-00')}
            </Text>
            {/* this button will open a CancelOrderModal  */}
            <View style={{ width: '60%' }}>
              <DefaultButton
                title={t('Cancelar pedido')}
                secondary
                onPress={() => setModalVisible(true)}
              />
            </View>
          </View>
        </View>
      </ScrollView>
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
      <CancelOrderModal modalVisible={modalVisible} onModalClose={() => setModalVisible(false)} />
    </View>
  );
};
