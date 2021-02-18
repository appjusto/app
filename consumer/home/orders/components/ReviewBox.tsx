import { Feather } from '@expo/vector-icons';
import { ReviewType } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import PaddedView from '../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import Pill from '../../../../common/components/views/Pill';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

type Props = {
  comment: string;
  onComment: (value: string) => void;
  selectReview: (type: ReviewType) => void;
};

export const ReviewBox = ({ comment, onComment, selectReview }: Props) => {
  const [review, setReview] = React.useState('');
  return (
    <PaddedView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pill />
        <Text style={{ ...texts.md, ...texts.bold, marginLeft: 12 }}>
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
        <TouchableWithoutFeedback
          onPress={() => {
            selectReview('positive');
            setReview('positive');
          }}
        >
          <View
            style={{
              height: 64,
              width: 64,
              ...borders.default,
              borderRadius: 32,
              borderColor: colors.green500,
              backgroundColor: review === 'positive' ? colors.green500 : colors.white,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Feather name="thumbs-up" size={24} />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            selectReview('negative');
            setReview('negative');
          }}
        >
          <View
            style={{
              height: 64,
              width: 64,
              ...borders.default,
              borderRadius: 32,
              borderColor: colors.green500,
              marginLeft: padding,
              backgroundColor: review === 'negative' ? colors.green500 : colors.white,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Feather name="thumbs-down" size={24} />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <Text style={{ ...texts.md, color: colors.grey700, marginBottom: halfPadding }}>
        {t(
          'Se preferir, descreva a sua experiência para outros clientes. Sua avaliação será anônima.'
        )}
      </Text>
      <DefaultInput
        editable={review === 'positive' || review === 'negative'}
        placeholder={t('Escreva sua mensagem')}
        multiline
        numberOfLines={6}
        value={comment}
        onChangeText={onComment}
        style={{ height: 80 }}
      />
    </PaddedView>
  );
};
