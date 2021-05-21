import React from 'react';
import { Text, View } from 'react-native';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { IconSemaphoreSmall } from '../../../../common/icons/icon-semaphore-small';
import { borders, colors, halfPadding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

type Props = {
  description: string;
};

export const RouteIssueCard = ({ description }: Props) => {
  return (
    <PaddedView style={{ ...borders.default, backgroundColor: colors.grey50 }}>
      <View style={{ ...screens.centered, backgroundColor: colors.grey50 }}>
        <IconSemaphoreSmall />
        <Text style={{ ...texts.sm, marginTop: halfPadding }}>{t('Problemas no endereço')}</Text>
        <Text style={{ ...texts.xs, color: colors.grey700 }}>{description}</Text>
      </View>
    </PaddedView>
  );
};
