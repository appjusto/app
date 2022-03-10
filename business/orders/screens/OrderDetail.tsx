import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import { cpfFormatter } from '../../../common/components/inputs/pattern-input/formatters';
import DoubleHeader from '../../../common/components/texts/DoubleHeader';
import RoundedText from '../../../common/components/texts/RoundedText';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { useSegmentScreen } from '../../../common/store/api/track';
import { borders, colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { formatCurrency, formatDuration, formatTime } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { LoggedBusinessNavParamsList } from '../../types';
import { CancelOrderModal } from '../components/CancelOrderModal';
import { CookingTimeModal } from '../components/CookingTimeModal';
import { OrderDispatchingMap } from '../components/OrderDispatchingMap';
import { OrderListItem } from '../components/OrderListItem';
import { RemainingTime } from '../components/RemainingTime';

type ScreenNavigationProp = StackNavigationProp<LoggedBusinessNavParamsList, 'OrderDetail'>;
type ScreenRouteProp = RouteProp<LoggedBusinessNavParamsList, 'OrderDetail'>;

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
      return <Text style={{ ...texts.md, marginBottom: halfPadding }}>{order.additionalInfo}</Text>;
    }
    if (order.consumer.cpf) {
      return (
        <Text style={{ ...texts.md, marginBottom: halfPadding }}>
          {t('Incluir CPF na nota, CPF: ')}
          {cpfFormatter(order.consumer.cpf)}
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
          subtitle={`Horário do pedido: ${formatTime(order.createdOn!)}`}
        />
        <PaddedView>
          {/* order.status */}
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <RoundedText backgroundColor={colors.red} noBorder color={colors.white}>
              Pendente
            </RoundedText>
            {/* cooking time component. status === 'preparing' */}
            <RemainingTime />
          </View>
          <Text style={{ ...texts.md, marginTop: halfPadding }}>
            {t('Nome do cliente: ')}
            <Text style={texts.bold}>{order.consumer.name}</Text>
          </Text>
        </PaddedView>
        {/* when status === 'dispatching' */}
        <OrderDispatchingMap order={order} style={{ marginTop: padding }} />
        <View style={{ marginTop: padding }}>
          <SingleHeader title={t('Detalhes do pedido')} />
        </View>
        <View
          style={{ paddingTop: halfPadding, paddingHorizontal: padding, paddingBottom: padding }}
        >
          <View>
            <Text style={{ ...texts.md, marginBottom: halfPadding }}>
              {t('Tempo de preparo: ')}
              <Text style={texts.bold}>{formatDuration(order.cookingTime!)}</Text>
            </Text>
            <View style={{ width: '60%' }}>
              <DefaultButton
                title={t('Alterar tempo de preparo')}
                secondary
                onPress={() => setCookingModalVisible(true)}
              />
            </View>
          </View>
          <View style={{ marginTop: padding, marginBottom: 32 }}>
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
            <View
              style={{
                backgroundColor: colors.white,
                paddingVertical: 12,
                paddingHorizontal: padding,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                ...borders.default,
                borderRadius: 0,
                marginTop: 4,
              }}
            >
              <Text style={{ ...texts.sm }}>{t('Valor total dos itens')}</Text>
              <Text style={[texts.sm, texts.bold]}>{formatCurrency(order.fare!.total)}</Text>
            </View>
          </View>
        </View>
        <SingleHeader title={t('Destino do pedido')} />
        <View style={{ marginTop: halfPadding, marginBottom: 32, paddingHorizontal: padding }}>
          <Text style={{ ...texts.md }}>{order.destination?.address.description}</Text>
        </View>
        <SingleHeader title={t('Forma de pagamento')} />
        <View style={{ paddingTop: halfPadding, paddingHorizontal: padding }}>
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
            style={{
              paddingTop: halfPadding,
              paddingHorizontal: padding,
              paddingBottom: padding,
            }}
          >
            {additionalInfoUI()}
            {/* this button will open a CancelOrderModal  */}
            <View style={{ width: '60%', marginTop: padding }}>
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
          {/* this button will be enabled/disabled, have diffent appearance and do different things */}
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
