import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import DoubleHeader from '../../../common/components/texts/DoubleHeader';
import RoundedText from '../../../common/components/texts/RoundedText';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { useSegmentScreen } from '../../../common/store/api/track';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { formatCurrency } from '../../../common/utils/formatters';
import { LoggedNavigatorParamList } from '../../../consumer/v2/types';
import { t } from '../../../strings';
import { CancelOrderModal } from '../components/CancelOrderModal';
import { CookingTimeModal } from '../components/CookingTimeModal';
import { OrderListItem } from '../components/OrderListItem';
// TODO: add the correct screenNavigationProp
type ScreenNavigationProp = StackNavigationProp<LoggedNavigatorParamList, 'OrderDetail'>;
type ScreenRouteProp = RouteProp<LoggedNavigatorParamList, 'OrderDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OrderDetail = ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;
  // state
  const order = useObserveOrder(orderId);
  const [cancelModalVisible, setCancelModalVisible] = React.useState(false);
  const [cookingModalVisible, setCookingModalVisible] = React.useState(false);
  // tracking
  useSegmentScreen('OrderDetail');
  //UI
  const additionalInfoUI = () => {
    if (!order) return;
    if (order.additionalInfo) {
      return (
        <Text style={{ ...texts.md, marginBottom: halfPadding }}>
          {t('Incluir CPF na nota, CPF: ')}
          {order.consumer.cpf}
        </Text>
      );
    }
    if (order.consumer.cpf) {
      return (
        // we need to format the cpf number
        <Text style={{ ...texts.md, marginBottom: halfPadding }}>
          {t('Incluir CPF na nota, CPF: ')}
          {order.consumer.cpf}
        </Text>
      );
    }
  };
  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <View style={{ ...screens.config }}>
      <ScrollView
        style={{ ...screens.config }}
        contentContainerStyle={{ flexGrow: 1 }}
        scrollIndicatorInsets={{ right: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <DoubleHeader
          title={`${t('Pedido Nº ')}${order.code}`}
          subtitle={t('Horário do pedido: 00h00m00s')} // add this
        />
        <PaddedView>
          {/* order.status */}
          <RoundedText backgroundColor={colors.red} noBorder color={colors.white}>
            Pendente
          </RoundedText>
          <Text style={{ ...texts.md, marginTop: halfPadding }}>
            {t('Nome do cliente: ')}
            <Text style={texts.bold}>{order.consumer.name}</Text>
          </Text>
          {/* do we have this? */}
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
            {/* format cooking time correctly */}
            <Text style={{ ...texts.md, marginBottom: halfPadding }}>
              {t('Tempo de preparo: ')}
              <Text style={texts.bold}>{order.cookingTime}</Text>
            </Text>
            {/* this button will open a modal for selecting cooking time */}
            <View style={{ width: '60%' }}>
              <DefaultButton
                title={t('Alterar tempo de preparo')}
                secondary
                onPress={() => setCookingModalVisible(true)}
              />
            </View>
          </View>
          <View style={{ marginTop: padding, marginBottom: 40 }}>
            {/* add qtde. item valor/item "line" on top of OrderItem list here */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: halfPadding }}>
              <View style={{ width: '17%', alignItems: 'flex-start' }}>
                <Text style={{ ...texts.sm, color: colors.grey700 }}>{t('Qtde.')}</Text>
              </View>
              <View style={{ width: '56%', alignItems: 'flex-start' }}>
                <Text style={{ ...texts.sm, color: colors.grey700 }}>{t('Item')}</Text>
              </View>
              <View style={{ width: '27%', alignItems: 'flex-end' }}>
                <Text style={{ ...texts.sm, color: colors.grey700 }}>{t('Valor/ item')}</Text>
              </View>
            </View>
            {order.items?.map((item, index) => (
              <OrderListItem item={item} key={`${index} + ${item.id}`} />
            ))}
          </View>
          {/* add OrderItem list here */}
        </View>
        <SingleHeader title={t('Forma de pagamento')} />
        <View
          style={{ paddingTop: halfPadding, paddingHorizontal: padding, paddingBottom: padding }}
        >
          <Text style={{ ...texts.md }}>
            {t('Total pago: ')}
            <Text style={texts.bold}>{formatCurrency(order.fare!.total)}</Text>
          </Text>
          {/* for now, this doesn't change */}
          <Text style={{ ...texts.md, marginTop: 4 }}>
            {t('Método de pagamento: ')}
            <Text style={texts.bold}>{t('pagamento via app')}</Text>
          </Text>
        </View>
        <View style={{ marginTop: padding, flex: 1 }}>
          {order.additionalInfo || order.consumer.cpf ? (
            <SingleHeader title={t('Observações')} />
          ) : null}
          <View
            style={{ paddingTop: halfPadding, paddingHorizontal: padding, paddingBottom: padding }}
          >
            {additionalInfoUI()}
            {/* this button will open a CancelOrderModal  */}
            <View style={{ width: '60%', marginTop: 32 }}>
              <DefaultButton
                title={t('Cancelar pedido')}
                secondary
                onPress={() => setCancelModalVisible(true)}
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
      <CancelOrderModal
        modalVisible={cancelModalVisible}
        onModalClose={() => setCancelModalVisible(false)}
      />
      <CookingTimeModal
        buttonTitle={t('Confirmar tempo de preparo')}
        modalVisible={cookingModalVisible}
        onModalClose={() => setCookingModalVisible(false)}
        onConfirmOrder={
          // confirmOrder after setting cooking time
          // close modal
          () => setCookingModalVisible(false)
        }
      />
    </View>
  );
};
