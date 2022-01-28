import { ReviewType } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import { t } from 'i18n-js';
import React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';

type Props = {
  review?: ReviewType;
  onReviewChange?: (type: ReviewType) => void;
};

export const ThumbSelector = ({ review, onReviewChange }: Props) => {
  return (
    <PaddedView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View>
          <Text style={{...texts.xl}}>{String.fromCodePoint(U+1F9BD)}<Text style={{marginLeft: halfPadding}}>{t('Entregador')}</Text></Text>
        </View>
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
              backgroundColor: review === 'positive' ? colors.green500 : colors.red,
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
    </PaddedView>
  );
};
