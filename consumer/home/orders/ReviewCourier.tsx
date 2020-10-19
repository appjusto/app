import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import * as icons from '../../../assets/icons';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedProfileImg from '../../../common/components/icons/RoundedProfileImg';
import DefaultInput from '../../../common/components/inputs/DefaultInput';
import HR from '../../../common/components/views/HR';
import Pill from '../../../common/components/views/Pill';
import { halfPadding, screens, texts, colors, padding, borders } from '../../../common/styles';
import { formatDate } from '../../../common/utils/formatters';
import { t } from '../../../strings';
import { HistoryParamList } from '../../history/types';

type ScreenNavigationProp = StackNavigationProp<HistoryParamList, 'ReviewCourier'>;
type ScreenRoute = RouteProp<HistoryParamList, 'ReviewCourier'>;

type Props = {
  route: ScreenRoute;
};

export default function ({ route }: Props) {
  // missing logic to register the reviews

  //context
  const { courier } = route.params;
  //screen state
  const [positive, setPositive] = useState(false);
  const [negative, setNegative] = useState(false);
  const joinedOn = (courier!.joined as firebase.firestore.Timestamp).toDate();
  const [reviewComment, setReviewComment] = useState<string>('');
  //handlers
  const positiveHandler = () => {
    setPositive(!positive);
    setNegative(false);
    //logic to send the selection to firestore
  };
  const negativeHandler = () => {
    setNegative(!negative);
    setPositive(false);
    //logic to send the selection to firestore
  };
  return (
    <View style={{ ...screens.default }}>
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
                backgroundColor: positive ? colors.green : colors.white,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image source={icons.thumbUp} />
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
                backgroundColor: negative ? colors.green : colors.white,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image source={icons.thumbDown} />
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
        <DefaultButton title={t('Enviar')} onPress={() => null} />
      </PaddedView>
    </View>
  );
}
