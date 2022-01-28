import { ReviewType } from '@appjusto/types';
import React from 'react';
import { Text, TextInputProps, View } from 'react-native';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import { colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { ThumbSelector } from './ThumbSelector';

interface Props extends TextInputProps {
  comment?: string;
  reviewType?: ReviewType;
  onCommentChange?: (value: string) => void;
  onReviewChange?: (type: ReviewType) => void;
}

export const ReviewBox = ({
  comment,
  reviewType,
  editable,
  onCommentChange,
  onReviewChange,
}: Props) => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <SingleHeader title={t('Avalie sua experiência')} />
      <ThumbSelector
        title={t('Como foi a sua experiência com o entregador?')}
        review={reviewType}
        onReviewChange={onReviewChange}
      />
      <View>
        <View style={{ paddingHorizontal: padding, paddingBottom: halfPadding }}>
          <Text style={{ ...texts.md, color: colors.grey700, paddingVertical: halfPadding }}>
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
      </View>
    </View>
  );
};
