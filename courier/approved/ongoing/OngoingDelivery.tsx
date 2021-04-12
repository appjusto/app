import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import HR from '../../../common/components/views/HR';
import { CourierDistanceBadge } from '../../../common/screens/orders/ongoing/CourierDistanceBadge';
import { StatusAndMessages } from '../../../common/screens/orders/ongoing/StatusAndMessages';
import OrderMap from '../../../common/screens/orders/OrderMap';
import { courierNextPlace } from '../../../common/store/api/order/helpers';
import useObserveOrder from '../../../common/store/api/order/hooks/useObserveOrder';
import { showToast } from '../../../common/store/ui/actions';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { CourierDeliveryInfo } from '../components/CourierDeliveryInfo';
import { ApprovedParamList } from '../types';
import { CodeInput } from './code-input/CodeInput';
import { RouteIcons } from './RouteIcons';
import { StatusControl } from './StatusControl';
import { OngoingDeliveryNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingDeliveryNavigatorParamList, 'OngoingDelivery'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRoute = RouteProp<OngoingDeliveryNavigatorParamList, 'OngoingDelivery'>;

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
        dispatch(showToast(error.toString(), 'error'));
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
        dispatch(showToast(error.toString(), 'error'));
      }
      setLoading(false);
    })();
  };
  const { type, dispatchingState, status } = order;
  const nextStepDisabled =
    isLoading ||
    (type === 'food' && dispatchingState === 'arrived-pickup' && status !== 'dispatching');
  const nextStepLabel = (() => {
    const dispatchingState = order?.dispatchingState;
    if (!dispatchingState || dispatchingState === 'going-pickup') {
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
    if (!dispatchingState || dispatchingState === 'going-pickup') {
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
    <ScrollView style={{ ...screens.default, paddingBottom: padding }}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'flex-end' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -148}
      >
        <View>
          <OrderMap order={order!} ratio={360 / 316} />
          <RouteIcons order={order} />
          <View>
            <StatusAndMessages
              dispatchingState={dispatchingState}
              orderId={orderId}
              onMessageReceived={() => navigation.navigate('Chat', { orderId })}
            />
          </View>
        </View>
        <View style={{ marginTop: padding, paddingHorizontal: padding }}>
          <CourierDeliveryInfo
            order={order}
            onChat={() => navigation.navigate('Chat', { orderId })}
            onProblem={() =>
              navigation.navigate('ReportIssue', {
                orderId,
                issueType: 'courier-delivery-problem',
              })
            }
          />
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
          <View style={{ marginBottom: padding }}>
            <Text style={[texts.xs, { color: colors.green600 }]}>{addressLabel}</Text>
            <Text style={[texts.xs]}>{nextPlace?.address.main}</Text>
          </View>
          <View>
            <CourierDistanceBadge order={order} />
          </View>
        </View>
        {/* Slider */}
        {dispatchingState !== 'arrived-destination' ? (
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
        ) : null}
        {dispatchingState === 'arrived-destination' ? (
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
        ) : null}
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
