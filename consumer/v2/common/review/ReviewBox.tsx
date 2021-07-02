import { ReviewType } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInputProps, TouchableWithoutFeedback, View } from 'react-native';
import PaddedView from '../../../../common/components/containers/PaddedView';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import Pill from '../../../../common/components/views/Pill';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

interface Props extends TextInputProps {
  comment?: string;
  review?: ReviewType;
  onCommentChange?: (value: string) => void;
  onReviewChange?: (type: ReviewType) => void;
}

export const ReviewBox = ({
  comment,
  review,
  editable,
  onCommentChange,
  onReviewChange,
}: Props) => {
  return (
    <PaddedView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Pill />
        <Text style={{ ...texts.md, ...texts.bold, marginLeft: 12 }}>
          {t('Como foi a sua experiência com o/a entregador/a?')}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: padding,
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            if (onReviewChange) onReviewChange('positive');
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
            if (onReviewChange) onReviewChange('negative');
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
      <View>
        <Text style={{ ...texts.md, color: colors.grey700, marginBottom: halfPadding }}>
          {t(
            'Se preferir, descreva a sua experiência para outros clientes. Sua avaliação será anônima.'
          )}
        </Text>
        <DefaultInput
          editable={editable}
          placeholder={t('Escreva sua mensagem')}
          multiline
          numberOfLines={6}
          value={comment}
          onChangeText={onCommentChange}
          style={{ height: 80 }}
        />
      </View>
    </PaddedView>
  );
};
