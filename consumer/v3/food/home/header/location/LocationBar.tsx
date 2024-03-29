import { isEmpty } from 'lodash';
import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import PaddedView from '../../../../../../common/components/containers/PaddedView';
import { getConsumer, getCurrentPlace } from '../../../../../../common/store/consumer/selectors';
import { padding } from '../../../../../../common/styles';
import { formatAddress } from '../../../../../../common/utils/formatters';
import { PillButton } from '../../../../common/buttons/PillButton';
import { texts } from '../../../../common/styles/fonts';
import { padding2 } from '../../../../common/styles/padding';
import { IconGPS } from './assets/IconGPS';

interface Props {
  onChangePlace: () => void;
}

export const LocationBar = ({ onChangePlace }: Props) => {
  // redux store
  const consumer = useSelector(getConsumer);
  const currentPlace = useSelector(getCurrentPlace);
  // UI
  const address = currentPlace?.address ? formatAddress(currentPlace.address) : '';
  if (!consumer) return null;
  if (isEmpty(address)) {
    return (
      <View>
        <PillButton title="Escolher local de entrega" onPress={onChangePlace} />
      </View>
    );
  }
  return (
    <PaddedView style={{ flexDirection: 'row', alignItems: 'center' }}>
      <IconGPS />
      <Text
        style={{ ...texts.xs, marginLeft: padding2, flex: 1, flexGrow: 1, marginRight: padding }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {address}
      </Text>
      <PillButton title="Alterar local" onPress={onChangePlace} />
    </PaddedView>
  );
};
