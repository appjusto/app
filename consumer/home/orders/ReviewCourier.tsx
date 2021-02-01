import { Feather } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ReviewType } from 'appjusto-types';
import React, { useCallback, useContext, useState } from 'react';
import { Text, View } from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedProfileImg from '../../../common/components/icons/RoundedProfileImg';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import HR from '../../../common/components/views/HR';
import Pill from '../../../common/components/views/Pill';
import { sendCourierReview } from '../../../common/store/order/actions';
import { showToast } from '../../../common/store/ui/actions';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { borders, colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { formatDate } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { HistoryParamList } from '../../history/types';

type ScreenNavigationProp = StackNavigationProp<HistoryParamList, 'ReviewCourier'>;
type ScreenRoute = RouteProp<HistoryParamList, 'ReviewCourier'>;

type Props = {
  route: ScreenRoute;
  navigation: ScreenNavigationProp;
};

export default function ({ route, navigation }: Props) {
  //context
  const { courier, orderId } = route.params;
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const busy = useSelector(getUIBusy);

  //screen state
  const [review, setReview] = useState<ReviewType>();
  const joinedOn = (courier!.joined as firebase.firestore.Timestamp).toDate();
  const [reviewComment, setReviewComment] = useState<string>('');

  //handlers
  const positiveHandler = () => {
    setReview('positive');
  };

  const negativeHandler = () => {
    setReview('negative');
  };

  const sendReviewCourier = useCallback(() => {
    if (!review) return;
    (async () => {
      try {
        await dispatch(
          sendCourierReview(api)(orderId, {
            type: review,
            comment: reviewComment,
          })
        );
      } catch (error) {
        dispatch(showToast(t('Não foi possível enviar o comentário')));
      }
      navigation.goBack();
    })();
  }, [review, reviewComment]);

  return (
    <View style={{ ...screens.default }}>
      <ScrollView>
        <PaddedView style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <RoundedProfileImg id={courier?.id} />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={{ ...texts.medium, marginBottom: halfPadding }}>{courier?.name}</Text>
            <Text style={{ ...texts.small, color: colors.darkGrey }}>No appJusto desde</Text>
            <Text style={{ ...texts.small }}>{formatDate(joinedOn, 'monthYear')}</Text>
          </View>
        </PaddedView>
        <HR height={padding} />
        <PaddedView style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pill />
            <Text style={{ ...texts.medium, ...texts.bold, marginLeft: 12 }}>
              {t('Como foi a sua experiência com o entregador?')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: padding,
              marginBottom: 24,
            }}
          >
            <TouchableWithoutFeedback onPress={positiveHandler}>
              <View
                style={{
                  height: 64,
                  width: 64,
                  ...borders.default,
                  borderRadius: 32,
                  borderColor: colors.green,
                  backgroundColor: review === 'positive' ? colors.green : colors.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Feather name="thumbs-up" size={24} />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={negativeHandler}>
              <View
                style={{
                  height: 64,
                  width: 64,
                  ...borders.default,
                  borderRadius: 32,
                  borderColor: colors.green,
                  marginLeft: padding,
                  backgroundColor: review === 'negative' ? colors.green : colors.white,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Feather name="thumbs-down" size={24} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Text style={{ ...texts.medium, color: colors.darkGrey, marginBottom: halfPadding }}>
            {t(
              'Se preferir, descreva a sua experiência para outros clientes. Sua avaliação será anônima.'
            )}
          </Text>
          <DefaultInput
            placeholder={t('Escreva sua mensagem')}
            multiline
            numberOfLines={6}
            value={reviewComment}
            onChangeText={setReviewComment}
          />
          <View style={{ flex: 1 }} />
          <DefaultButton
            title={t('Enviar')}
            onPress={sendReviewCourier}
            style={{ marginTop: padding }}
            disabled={!review || busy}
            activityIndicator={busy}
          />
          <View style={{ flex: 1 }} />
        </PaddedView>
      </ScrollView>
    </View>
  );
}
