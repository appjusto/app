import { Feather } from '@expo/vector-icons';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedText from '../../../common/components/texts/RoundedText';
import HR from '../../../common/components/views/HR';
import { MessagesCard } from '../../../common/screens/home/cards/MessagesCard';
import { CourierDistanceBadge } from '../../../common/screens/orders/ongoing/CourierDistanceBadge';
import CourierStatusHighlight from '../../../common/screens/orders/ongoing/CourierStatusHighlight';
import { courierNextPlace } from '../../../common/store/api/order/helpers';
import useObserveOrder from '../../../common/store/api/order/hooks/useObserveOrder';
import { showToast } from '../../../common/store/ui/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import OrderMap from '../../../consumer/home/orders/p2p-order/OrderMap';
import SingleHeader from '../../../consumer/home/restaurants/SingleHeader';
import { t } from '../../../strings';
import { ApprovedParamList } from '../types';
import { CodeInput } from './code-input/CodeInput';
import { RouteIcons } from './RouteIcons';
import { StatusControl } from './StatusControl';
import { OngoingParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingParamList, 'OngoingDelivery'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRoute = RouteProp<OngoingParamList, 'OngoingDelivery'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export default function ({ navigation, route }: Props) {
  // params
  const { orderId, newMessage, completeWithoutConfirmation } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // screen state
  const { order } = useObserveOrder(orderId);
  const [code, setCode] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  // side effects
  // whenever params updates
  // open chat if there's a new message
  React.useEffect(() => {
    if (newMessage) {
      // workaround to make sure chat is being shown; (it was not showing on Android devices during tests)
      setTimeout(() => {
        navigation.setParams({ newMessage: false });
        navigation.navigate('Chat', { orderId });
      }, 100);
    }
  }, [newMessage]);
  React.useEffect(() => {
    if (!completeWithoutConfirmation) return;
    (async () => {
      setLoading(true);
      try {
        await api.order().completeDelivery(orderId, code);
      } catch (error) {
        dispatch(showToast(error.toSring()));
      }
      setLoading(false);
    })();
  }, [completeWithoutConfirmation]);
  // whenever order updates
  // check status to navigate to other screens
  React.useEffect(() => {
    if (order?.status === 'delivered') {
      navigation.replace('DeliveryCompleted', { orderId, fee: order.fare!.consumer.courierFee });
    } else if (order?.status === 'canceled') {
      navigation.replace('OrderCanceled', { orderId });
    }
  }, [order]);

  // UI
  if (!order) {
    // showing the indicator until the order is loaded
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }

  // UI handlers
  // handles updating dispatchingState
  const nextStatepHandler = () => {
    (async () => {
      setLoading(true);
      try {
        if (order.dispatchingState !== 'arrived-destination') {
          await api.order().nextDispatchingState(orderId);
        } else {
          await api.order().completeDelivery(orderId, code);
        }
      } catch (error) {
        dispatch(showToast(error.toSring()));
      }
      setLoading(false);
    })();
  };
  const { type, dispatchingState, status } = order;
  const nextStepDisabled =
    isLoading || (type === 'food' && dispatchingState === 'arrived-pickup' && status !== 'ready');
  const nextStepLabel = (() => {
    const dispatchingState = order?.dispatchingState;
    if (dispatchingState === 'going-pickup') {
      return t('Cheguei para Retirada');
    } else if (dispatchingState === 'arrived-pickup') {
      return t('Saí para Entrega');
    } else if (dispatchingState === 'going-destination') {
      return t('Cheguei para entrega');
    } else if (dispatchingState === 'arrived-destination') {
      return t('Finalizar entrega');
    }
    return '';
  })();
  const nextPlace = courierNextPlace(order);
  const addressLabel = (() => {
    if (dispatchingState === 'going-pickup') {
      return t('Retirada em');
    } else if (
      dispatchingState === 'arrived-pickup' ||
      dispatchingState === 'arrived-destination' ||
      dispatchingState === 'going-destination'
    ) {
      return t('Entrega em');
    }
    return '';
  })();

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ ...screens.default, paddingBottom: padding }}>
      <View style={{ flex: 1 }}>
        <OrderMap order={order!} />
        <RouteIcons order={order} />
        <CourierStatusHighlight dispatchingState={dispatchingState} />
        <View style={{ paddingHorizontal: padding }}>
          <View
            style={{
              width: '100%',
              marginBottom: padding,
              top: -64,
              alignSelf: 'center',
            }}
          >
            <MessagesCard
              orderId={orderId}
              onPress={() => navigation.navigate('Chat', { orderId })}
            />
          </View>
        </View>
      </View>
      <View style={{ marginTop: padding, paddingHorizontal: padding }}>
        <Text style={[texts.xs, { color: colors.green600 }]}>{t('Pedido de')}</Text>
        <Text style={[texts.md]}>
          {!isEmpty(order.consumer.name) ? order.consumer.name : t('Cliente')}
        </Text>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: padding }}
        >
          <TouchableOpacity onPress={() => navigation.navigate('Chat', { orderId })}>
            <View style={{ marginTop: halfPadding }}>
              <RoundedText
                leftIcon={<Feather name="message-circle" size={12} style={{ marginRight: 6 }} />}
              >
                {t('Iniciar chat')}
              </RoundedText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ReportIssueCourierDeliveryProblem', {
                orderId,
                issueType: 'courier-delivery-problem',
              })
            }
          >
            <View style={{ marginTop: halfPadding }}>
              <RoundedText
                color={colors.red}
                leftIcon={
                  <Feather name="info" size={12} color={colors.red} style={{ marginRight: 6 }} />
                }
              >
                {t('Tive um problema')}
              </RoundedText>
            </View>
          </TouchableOpacity>
        </View>
        <HR />
      </View>
      <View
        style={{
          paddingHorizontal: padding,
          flexDirection: 'row',
          marginTop: padding,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={[texts.xs, { color: colors.green600 }]}>{addressLabel}</Text>
          <Text style={[texts.xs]}>{nextPlace?.address.main}</Text>
        </View>
        <View>
          <CourierDistanceBadge order={order} />
        </View>
      </View>
      {/* Slider */}
      {dispatchingState !== 'arrived-destination' && (
        <View style={{ marginTop: padding, paddingHorizontal: padding }}>
          <StatusControl
            key={dispatchingState}
            style={{ marginBottom: padding }}
            text={nextStepLabel}
            disabled={nextStepDisabled}
            isLoading={isLoading}
            onConfirm={nextStatepHandler}
          />
        </View>
      )}
      {dispatchingState === 'arrived-destination' && (
        <View>
          <HR height={padding} />
          <View style={{ paddingTop: halfPadding, paddingBottom: padding }}>
            <SingleHeader title={t('Código de confirmação')} />
            <View style={{ paddingHorizontal: padding }}>
              <Text style={{ ...texts.sm, marginBottom: padding }}>
                {t('Digite o código de confirmação fornecido pelo cliente:')}
              </Text>
              <CodeInput value={code} onChange={setCode} />
              <DefaultButton
                title={nextStepLabel}
                onPress={nextStatepHandler}
                activityIndicator={isLoading}
                disabled={isLoading || code.length < 3}
                style={{ marginTop: padding }}
              />
            </View>
          </View>
          <HR height={padding} />
          <PaddedView>
            <DefaultButton
              secondary
              title={t('Confirmar entrega sem código')}
              onPress={() => navigation.navigate('NoCodeDelivery', { orderId })}
            />
          </PaddedView>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
}
