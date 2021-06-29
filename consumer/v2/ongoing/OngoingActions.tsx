import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Order, WithId } from '../../../../types';
import PaddedView from '../../../common/components/containers/PaddedView';
import { colors, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  order: WithId<Order>;
};

export const OngoingActions = ({ order }: Props) => {
  return (
    <PaddedView style={{ flex: 1 }}>
      <Text style={[texts.xs, { color: colors.green600 }]}>{t('Entregar em')}</Text>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <View>
          <Text style={[texts.xs]} numberOfLines={2}>
            {order.destination?.address.main ?? ''}
          </Text>
          {order.destination?.additionalInfo ? (
            <View>
              {/* check if a longer text will fit here */}
              <Text style={{ ...texts.xs, color: colors.grey700 }}>
                {order.destination?.additionalInfo}
              </Text>
            </View>
          ) : null}
          {order.destination?.intructions ? (
            <View>
              <Text style={{ ...texts.xs, color: colors.grey700 }}>
                {order.destination?.intructions}
              </Text>
            </View>
          ) : null}
        </View>
        <View>
          <TouchableOpacity onPress={() => null}>
            <Text style={[texts.xs]}>{t('Alterar')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PaddedView>
  );
};
