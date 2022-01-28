import { ReviewType } from '@appjusto/types';
import React from 'react';
import { Text, TextInputProps, View } from 'react-native';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import HR from '../../../../common/components/views/HR';
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
        backgroundColor: colors.white,
        paddingBottom: padding,
      }}
    >
      <SingleHeader title={t('Avalie sua experiência')} />
      <ThumbSelector
        title="Entregador"
        iconUnicode={0x1f6f5}
        review={reviewType}
        onReviewChange={onReviewChange}
      />
      <ThumbSelector
        title="Restaurante"
        iconUnicode={0x1f373}
        review={reviewType}
        onReviewChange={onReviewChange}
      />
      <ThumbSelector
        title="AppJusto"
        iconUnicode={0x1f4f1}
        review={reviewType}
        onReviewChange={onReviewChange}
      />
      <HR height={padding} style={{ backgroundColor: colors.grey50 }} />
      <View>
        <SingleHeader title={t('Deixe um comentário')} />
        <View style={{ paddingHorizontal: padding, paddingBottom: halfPadding }}>
          <Text style={{ ...texts.md, color: colors.grey700, paddingVertical: halfPadding }}>
            {t('Se preferir, descreva a sua experiência de forma anônima.')}
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
