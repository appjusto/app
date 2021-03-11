import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ReviewType } from 'appjusto-types';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedProfileImg from '../../../common/components/icons/RoundedProfileImg';
import HR from '../../../common/components/views/HR';
import { showToast } from '../../../common/store/ui/actions';
import { getUIBusy } from '../../../common/store/ui/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { HistoryParamList } from '../../history/types';
import { ReviewBox } from './components/ReviewBox';

type ScreenNavigationProp = StackNavigationProp<HistoryParamList, 'ReviewCourier'>;
type ScreenRoute = RouteProp<HistoryParamList, 'ReviewCourier'>;

type Props = {
  route: ScreenRoute;
  navigation: ScreenNavigationProp;
};

export default function ({ route, navigation }: Props) {
  //context
  const { courierId, courierName, courierJoined, orderId } = route.params;
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const busy = useSelector(getUIBusy);

  //screen state
  const [reviewType, setReviewType] = React.useState<ReviewType>();
  const [comment, setComment] = React.useState();

  // UI handlers
  const sendReviewCourier = () => {
    if (!reviewType) return;
    (async () => {
      try {
        await api.courier().addReview(courierId, {
          type: reviewType,
          orderId,
          comment,
        });
      } catch (error) {
        dispatch(showToast(t('Não foi possível enviar o comentário')));
      }
      navigation.goBack();
    })();
  };

  return (
    <View style={{ ...screens.default }}>
      <ScrollView>
        <PaddedView style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <RoundedProfileImg id={courierId} />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={{ ...texts.md, marginBottom: halfPadding }}>{courierName}</Text>
            <Text style={{ ...texts.xs, color: colors.grey700 }}>No appJusto desde</Text>
            <Text style={{ ...texts.xs }}>{courierJoined}</Text>
          </View>
        </PaddedView>
        <HR height={padding} />
        <ReviewBox
          review={reviewType}
          onReviewChange={(type) => setReviewType(type)}
          comment={comment}
          onCommentChange={() => setComment(comment)}
        />
        <View style={{ flex: 1 }} />
        <DefaultButton
          title={t('Enviar')}
          onPress={sendReviewCourier}
          style={{ marginTop: padding }}
          disabled={!reviewType || busy}
          activityIndicator={busy}
        />
      </ScrollView>
    </View>
  );
}
