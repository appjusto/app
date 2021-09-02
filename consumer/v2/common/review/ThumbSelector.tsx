import { ReviewType } from '@appjusto/types';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import PaddedView from '../../../../common/components/containers/PaddedView';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import { borders, colors, padding } from '../../../../common/styles';

type Props = {
  title: string;
  review?: ReviewType;
  onReviewChange?: (type: ReviewType) => void;
};

export const ThumbSelector = ({ title, review, onReviewChange }: Props) => {
  return (
    <View>
      <SingleHeader title={title} />
      <PaddedView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
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
      </PaddedView>
    </View>
  );
};
