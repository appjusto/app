import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ReviewType } from 'appjusto-types';
import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import * as icons from '../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import HR from '../../../common/components/views/HR';
import useObserveOrder from '../../../common/store/api/order/hooks/useObserveOrder';
import { showToast } from '../../../common/store/ui/actions';
import { colors, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { LoggedParamList } from '../../types';
import TipControl from './common/TipControl';
import { ReviewBox } from './components/ReviewBox';
import { OrderNavigatorParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OrderNavigatorParamList, 'OrderDeliveredFeedback'>,
  BottomTabNavigationProp<LoggedParamList>
>;
type ScreenRouteProp = RouteProp<OrderNavigatorParamList, 'OrderDeliveredFeedback'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default ({ navigation, route }: Props) => {
  // params
  const { orderId } = route.params;
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // screen state
  const { order } = useObserveOrder(orderId);
  const [comment, setComment] = React.useState('');
  const [reviewType, setReviewType] = React.useState<ReviewType>();
  const [tip, setTip] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);

  if (!order) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }

  //handler
  const finishHandler = async () => {
    setLoading(true);
    try {
      if (reviewType) {
        await api.courier().addReview(order.courier!.id, {
          type: reviewType,
          comment,
          orderId,
        });
      }
      if (tip > 0) await api.order().tipCourier(order.id, tip);
      navigation.navigate('Home');
    } catch (error) {
      dispatch(showToast(t('Não foi possível enviar o comentário')));
    }
    setLoading(false);
  };
  // UI
  return (
    <View style={screens.default}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
        {/* header */}
        <PaddedView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 32,
              alignItems: 'center',
            }}
          >
            <Text style={[texts.x2l]}>{t('Pedido entregue')}</Text>
            <View style={{ height: 112, width: 160 }}>
              <Image
                source={icons.illustration}
                style={{ overflow: 'hidden', height: 112, width: 160 }}
              />
            </View>
          </View>
        </PaddedView>
        <HR height={padding} />
        {/* tip */}
        <TipControl order={order} tip={tip} onChange={(value) => setTip(value)} />
        <View
          style={{
            flexDirection: 'row',
            marginTop: padding,
            paddingHorizontal: padding,
          }}
        >
          <MaterialIcons name="check" size={24} />
          <View style={{ alignItems: 'flex-start', paddingHorizontal: padding }}>
            <Text style={{ ...texts.xs, color: colors.grey700 }}>
              {t('Entregas realizadas perfeitamente')}
            </Text>
            <Text style={{ ...texts.md }}>{order.courier?.statistics?.deliveries ?? 0}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 12,
            paddingHorizontal: padding,
          }}
        >
          <MaterialIcons name="thumb-up-off-alt" size={24} />
          <View style={{ alignItems: 'flex-start', paddingHorizontal: padding }}>
            <Text style={{ ...texts.xs, color: colors.grey700 }}>{t('Avaliações positivas')}</Text>
            <Text style={{ ...texts.md }}>{order.courier?.statistics?.negativeReviews ?? 0}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 12,
            paddingHorizontal: padding,
            marginBottom: padding,
          }}
        >
          <MaterialIcons name="thumb-down-off-alt" size={24} />
          <View style={{ alignItems: 'flex-start', paddingHorizontal: padding }}>
            <Text style={{ ...texts.xs, color: colors.grey700 }}>{t('Avaliações negativas')}</Text>
            <Text style={{ ...texts.md }}>{order.courier?.statistics?.negativeReviews ?? 0}</Text>
          </View>
        </View>
        <HR height={padding} />
        <ReviewBox
          comment={comment}
          onComment={(value) => setComment(value)}
          selectReview={(type) => setReviewType(type)}
        />
        <HR />
        {/* actions */}
        <View style={{ paddingHorizontal: padding }}>
          <DefaultButton
            title={t('Finalizar')}
            onPress={finishHandler}
            style={{ marginTop: padding }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: padding,
            }}
          >
            <View style={{ width: '49%' }}>
              <DefaultButton
                title={t('Relatar um problema')}
                secondary
                onPress={() => navigation.navigate('OrderComplaint', { orderId: order.id })}
              />
            </View>
            <View style={{ width: '49%' }}>
              <DefaultButton
                title={t('Detalhes da corrida')}
                onPress={() =>
                  navigation.navigate('HistoryNavigator', {
                    screen: 'OrderDetail',
                    params: { orderId },
                  })
                }
                secondary
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
