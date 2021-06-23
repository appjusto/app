import { Flavor } from '@appjusto/types';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useKeepAwake } from 'expo-keep-awake';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import { courierNextPlace } from '../../../common/store/api/order/helpers';
import { useObserveOrder } from '../../../common/store/api/order/hooks/useObserveOrder';
import { useSegmentScreen } from '../../../common/store/api/track';
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { CourierDeliveryInfo } from '../components/CourierDeliveryInfo';
import { ApprovedParamList } from '../types';
import { OngoingDeliveryCode } from './OngoingDeliveryCode';
import { OngoingDeliveryInfo } from './OngoingDeliveryInfo';
import { OngoingDeliveryMap } from './OngoingDeliveryMap';
import { StatusControl } from './StatusControl';
import { OngoingDeliveryNavigatorParamList } from './types';
import { WithdrawOrderModal } from './WithdrawOrderModal';

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
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // screen state
  const order = useObserveOrder(orderId);
  const [code, setCode] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const consumerId = order?.consumer.id;
  const businessId = order?.business?.id;
  // side effects
  // tracking
  useSegmentScreen('Ongoing Delivery');
  // keeping screen awake
  useKeepAwake();
  // helpers
  const openChat = React.useCallback(
    (counterpartId: string, counterpartFlavor: Flavor, delayed?: boolean) => {
      setTimeout(
        () => {
          navigation.navigate('Chat', {
            orderId,
            counterpartId,
            counterpartFlavor,
          });
        },
        delayed ? 100 : 0
      );
    },
    [navigation, orderId]
  );
  const openChatWithConsumer = React.useCallback(
    (delayed?: boolean) => openChat(consumerId!, 'consumer', delayed),
    [openChat, consumerId]
  );
  const openChatWithRestaurant = React.useCallback(
    (delayed?: boolean) => openChat(businessId!, 'business', delayed),
    [openChat, businessId]
  );
  // whenever params updates
  // open chat if there's a new message
  React.useEffect(() => {
    if (route.params.chatFrom) {
      navigation.setParams({ chatFrom: undefined });
      openChat(route.params.chatFrom.id, route.params.chatFrom.agent, true);
    }
  }, [route.params, navigation, openChat]);
  // whenever order updates
  // check status to navigate to other screens
  React.useEffect(() => {
    if (order?.status === 'delivered') {
      navigation.replace('DeliveryCompleted', { orderId, fee: order.fare!.courier.value });
    } else if (order?.status === 'canceled') {
      navigation.replace('OrderCanceled', { orderId });
    }
  }, [order, navigation, orderId]);
  // refs
  const codeDeliveryRef = React.useRef();

  // UI
  if (!order?.dispatchingState) {
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
        if (order.dispatchingState === 'going-destination') {
          await api.order().nextDispatchingState(orderId);
          setLoading(false);
        }
        // this will be handled by the codeDeliveryHandler
        // else if (order.dispatchingState === 'arrived-destination') {
        //   await api.order().completeDelivery(orderId, code);
        //   setLoading(false);
        // }
        else {
          await api.order().nextDispatchingState(orderId);
          setTimeout(() => {
            setLoading(false);
          }, 5000);
        }
      } catch (error) {
        dispatch(showToast(error.toString(), 'error'));
      }
    })();
  };
  const codeDeliveryHandler = () => {
    (async () => {
      setLoading(true);
      try {
        await api.order().completeDelivery(orderId, code);
        setLoading(false);
      } catch (error) {
        dispatch(showToast(error.toString(), 'error'));
        setLoading(false);
      } finally {
        setLoading(false);
      }
    })();
  };
  // UI
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
      return t('Confirmar entrega');
    }
    return '';
  })();
  const nextPlace = courierNextPlace(order);
  const addressLabel = (() => {
    if (!dispatchingState || dispatchingState === 'going-pickup') {
      return t('Retirada');
    } else if (
      dispatchingState === 'arrived-pickup' ||
      dispatchingState === 'arrived-destination' ||
      dispatchingState === 'going-destination'
    ) {
      return t('Entrega');
    }
    return '';
  })();
  const sliderColor = (() => {
    if (!dispatchingState || dispatchingState === 'going-pickup') {
      return colors.green500;
    } else return colors.darkYellow;
  })();
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      style={{ ...screens.default }}
      keyboardShouldPersistTaps="never"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={{ flex: 1 }}>
        {/* top panel */}
        {/* it appears all the time, except in food orders while the courier is going-pickup to the rest */}
        <CourierDeliveryInfo
          order={order}
          onChat={() => openChatWithConsumer()}
          onProblem={() => navigation.navigate('DeliveryProblem', { orderId })}
        />
        {/* center panel */}
        {/* it only appears while dispatchingState !== 'arrived-destination' */}
        {/* <View>
          <OrderMap order={order!} ratio={1} />
          <RouteIcons order={order} />
          <View>
            <StatusAndMessages order={order} onPress={(from) => openChat(from.id, from.agent)} />
          </View>
        </View> */}
        <OngoingDeliveryMap order={order} onOpenChat={(from) => openChat(from.id, from.agent)} />
        {/* bottom panel */}
        {/* <PaddedView>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={dispatchingState === 'going-pickup' ? pinPackageWhite : pinPackage}
              style={{ width: 23, height: 28 }}
            />
            <Text
              style={[
                texts.xs,
                texts.bold,
                { marginVertical: halfPadding, marginHorizontal: halfPadding },
              ]}
            >
              {addressLabel}
            </Text>
            <CourierDistanceBadge order={order} delivering />
          </View>
          <View style={{ marginTop: halfPadding }}>
            <Text style={[texts.xl]} numberOfLines={2}>
              {nextPlace?.address.main}
            </Text>
            <Text style={[texts.xl]} numberOfLines={2}>
              {nextPlace?.address.secondary}
            </Text>
            <Text style={[texts.md, { marginTop: 4, color: colors.grey700 }]}>
              {nextPlace?.additionalInfo ?? ''}
            </Text>
            <Text style={[texts.md, { marginTop: 4, color: colors.grey700 }]} numberOfLines={2}>
              {nextPlace?.intructions ?? ''}
            </Text>
          </View>
        </PaddedView> */}
        <OngoingDeliveryInfo
          order={order}
          onProblem={() => navigation.navigate('DeliveryProblem', { orderId })}
        />
        {/* Status slider */}
        {/* it appears while dispatchingState !== 'arrived-destination' */}
        {dispatchingState !== 'arrived-destination' ? (
          <View style={{ paddingHorizontal: padding }}>
            <StatusControl
              key={dispatchingState}
              style={{ marginBottom: padding }}
              text={nextStepLabel}
              disabled={nextStepDisabled}
              isLoading={isLoading}
              onConfirm={nextStatepHandler}
              color={sliderColor}
            />
          </View>
        ) : null}

        {/* code input. it appears when the courier arrived-pickup */}
        {/* <View>
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
        </View> */}
        <OngoingDeliveryCode
          // do we need to focus on this component when it appears?
          code={code}
          onSetCode={setCode}
          buttonTitle={t('Confirmar entrega')}
          onDelivery={codeDeliveryHandler}
          isLoading={isLoading}
          onNoCodeDelivery={() => navigation.navigate('NoCodeDelivery', { orderId })}
          dispatchingState={dispatchingState}
        />
        {/* withdrawal modal */}
        <WithdrawOrderModal visible onDismiss={() => null} order={order} />
      </View>
      {/* {order.type === 'p2p' ? (
        <View style={{ flex: 1 }}>
          {dispatchingState !== 'arrived-destination' && (
            <View>
              <OrderMap order={order!} ratio={1} />
              <RouteIcons order={order} />
              <View>
                <StatusAndMessages
                  order={order}
                  onPress={(from) => openChat(from.id, from.agent)}
                />
              </View>
            </View>
          )}
          <HR />
          <PaddedView>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={dispatchingState === 'going-pickup' ? pinPackageWhite : pinPackage}
                style={{ width: 23, height: 28 }}
              />
              <Text
                style={[
                  texts.xs,
                  texts.bold,
                  { marginVertical: halfPadding, marginHorizontal: halfPadding },
                ]}
              >
                {addressLabel}
              </Text>
              <CourierDistanceBadge order={order} delivering />
            </View>
            <View style={{ marginTop: halfPadding }}>
              <Text style={[texts.xl]} numberOfLines={2}>
                {nextPlace?.address.main}
              </Text>
              <Text style={[texts.xl]} numberOfLines={2}>
                {nextPlace?.address.secondary}
              </Text>
              <Text style={[texts.md, { marginTop: 4, color: colors.grey700 }]}>
                {nextPlace?.additionalInfo ?? ''}
              </Text>
              <Text style={[texts.md, { marginTop: 4, color: colors.grey700 }]} numberOfLines={2}>
                {nextPlace?.intructions ?? ''}
              </Text>
            </View>
          </PaddedView>
          {dispatchingState !== 'arrived-destination' ? (
            <View style={{ paddingHorizontal: padding }}>
              <StatusControl
                key={dispatchingState}
                style={{ marginBottom: padding }}
                text={nextStepLabel}
                disabled={nextStepDisabled}
                isLoading={isLoading}
                onConfirm={nextStatepHandler}
                color={sliderColor}
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
        </View>
      ) : (
        <View style={{ flex: 1 }}> */}
      {/* <View style={{ marginHorizontal: padding }}>
            <CourierDeliveryInfo
              order={order}
              onChat={() => openChatWithConsumer()}
              onProblem={() => navigation.navigate('DeliveryProblem', { orderId })}
            />
          </View> */}
      {/* {dispatchingState !== 'arrived-destination' && (
            <View>
              <OrderMap order={order!} ratio={1} />
              <RouteIcons order={order} />
              <View>
                <StatusAndMessages
                  order={order}
                  onPress={(from) => openChat(from.id, from.agent)}
                />
              </View>
            </View>
          )}
          <HR />
          <PaddedView>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={dispatchingState === 'going-pickup' ? pinPackageWhite : pinPackage}
                  style={{ width: 23, height: 28 }}
                />
                <Text
                  style={[
                    texts.xs,
                    texts.bold,
                    { marginVertical: halfPadding, marginHorizontal: halfPadding },
                  ]}
                >
                  {addressLabel}
                </Text>
                <CourierDistanceBadge order={order} delivering />
              </View>

              <View
                style={{
                  alignSelf: 'flex-end',
                  marginLeft: halfPadding,
                }}
              >
                <TouchableOpacity>
                  <RoundedText
                    color={colors.red}
                    leftIcon={
                      <Feather
                        name="info"
                        size={12}
                        color={colors.red}
                        style={{ marginRight: 4 }}
                      />
                    }
                  >
                    {t('Tive um problema')}
                  </RoundedText>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginTop: halfPadding }}>
              <Text style={[texts.xl]} numberOfLines={2}>
                {nextPlace?.address.main}
              </Text>
              <Text style={[texts.xl]} numberOfLines={2}>
                {nextPlace?.address.secondary}
              </Text>
              <Text style={[texts.md, { marginTop: 4, color: colors.grey700 }]}>
                {nextPlace?.additionalInfo ?? ''}
              </Text>
              <Text style={[texts.md, { marginTop: 4, color: colors.grey700 }]} numberOfLines={2}>
                {nextPlace?.intructions ?? ''}
              </Text>
            </View>
          </PaddedView>
          {dispatchingState !== 'arrived-destination' ? (
            <View style={{ paddingHorizontal: padding }}>
              <StatusControl
                key={dispatchingState}
                style={{ marginBottom: padding }}
                text={nextStepLabel}
                disabled={nextStepDisabled}
                isLoading={isLoading}
                onConfirm={nextStatepHandler}
                color={sliderColor}
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
          ) : null} */}
      {/* <DefaultModal
            header="Olá"
            body="Retire o pedido"
            dismissButtonTitle="Recebi o pedido"
            visible
            onDismiss={() => null}
          /> */}
      {/* <WithdrawOrderModal visible onDismiss={() => null} />
        </View>
      )} */}
    </KeyboardAwareScrollView>
  );
}
