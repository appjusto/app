import { Order, WithId } from 'appjusto-types';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import { colors, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';

type Props = {
  order: WithId<Order>;
  onChangeRoute: () => void;
  navigateToReportIssue: () => void;
  navigateToConfirmCancel: () => void;
};

export const DeliveryActions = ({
  order,
  onChangeRoute,
  navigateToReportIssue,
  navigateToConfirmCancel,
}: Props) => {
  return (
    <PaddedView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <Text style={[texts.xs, { color: colors.green600 }]}>{t('Entregar em')}</Text>
          <Text style={[texts.xs]}>{order.destination?.address.main ?? ''}</Text>
          <Text style={{ ...texts.xs, color: colors.grey700 }}>
            {order.destination?.additionalInfo ?? ''}
          </Text>
        </View>
        <TouchableOpacity onPress={onChangeRoute}>
          <Text style={[texts.xs, { color: colors.green600 }]}>{t('Alterar')}</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginTop: padding,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ width: '49%' }}>
          <DefaultButton
            title={t('Relatar um problema')}
            secondary
            onPress={navigateToReportIssue}
          />
        </View>
        <View style={{ width: '49%' }}>
          <DefaultButton title={t('Cancelar pedido')} secondary onPress={navigateToConfirmCancel} />
        </View>
      </View>
    </PaddedView>
  );
};
