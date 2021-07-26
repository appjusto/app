import { ReviewType } from '@appjusto/types';
import React from 'react';
import { Text, TextInputProps, View } from 'react-native';
import DefaultInput from '../../../../common/components/inputs/DefaultInput';
import { colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { ThumbSelector } from './ThumbSelector';

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
    <View
      style={{
        flex: 1,
        paddingTop: halfPadding,
        paddingBottom: padding,
      }}
    >
      <ThumbSelector
        title={t('Como foi a sua experiência com o entregador?')}
        review={review}
        onReviewChange={onReviewChange}
      />
      {/* <HR height={padding} />
      <ThumbSelector title={t('O que achou do valor do frete?')} />
      <HR height={padding} />
      <ThumbSelector title={t('O que achou do valor dos produtos?')} />
      <HR height={padding} /> */}
      <View>
        {/* <SingleHeader title={t('Deixe um comentário')} /> */}
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
        {/* <HR height={padding} />
        <SingleHeader title={t('Qual a probabilidade de indicar o AppJusto?')} /> */}
        {/* <View style={{ paddingHorizontal: padding }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: halfPadding,
            }}
          >
            <Text style={{ ...texts.xs, color: colors.grey700 }}>{t('Pouco provável')}</Text>
            <Text style={{ ...texts.xs, color: colors.grey700 }}>{t('Muito provável')}</Text>
          </View>
          <HomeShareCard
            title="Divulgue o AppJusto"
            subtitle="Compartilhe esse movimento por uma economia mais justa nas suas redes"
          />
        </View> */}
      </View>
    </View>
  );
};
