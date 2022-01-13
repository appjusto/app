import React from 'react';
import { Text, View } from 'react-native';
import { IconSemaphoreSmall } from '../../../../common/icons/icon-semaphore-small';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';

interface Props {
  issue: string;
}

export const RouteIssueCard = ({ issue }: Props) => {
  return (
    <View
      style={{
        ...borders.default,
        paddingHorizontal: padding,
        alignItems: 'center',
        paddingTop: 24,
        paddingBottom: padding,
        backgroundColor: colors.grey50,
      }}
    >
      <IconSemaphoreSmall />

      <Text style={{ ...texts.xs, marginTop: halfPadding, color: colors.grey700 }}>{issue}</Text>
    </View>
  );
};
