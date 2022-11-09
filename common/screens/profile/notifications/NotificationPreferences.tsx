import { NotificationChannel } from '@appjusto/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { isEmpty, without } from 'lodash';
import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { ProfileParamList } from '../../../../consumer/v2/main/profile/types';
import { CourierProfileParamList } from '../../../../courier/approved/main/profile/types';
import { t } from '../../../../strings';
import { ApiContext, AppDispatch } from '../../../app/context';
import CheckField from '../../../components/buttons/CheckField';
import PaddedView from '../../../components/containers/PaddedView';
import { useProfile } from '../../../store/api/profile/useProfile';
import { useSegmentScreen } from '../../../store/api/track';
import { getFlavor } from '../../../store/config/selectors';
import { biggerPadding, colors, halfPadding, padding, screens, texts } from '../../../styles';
import { NotificationConfirmationModal } from './NotificationConfirmationModal';

export type NotificationPreferencesParamList = {
  NotificationPreferences: undefined;
};

type ScreenNavigationProp = StackNavigationProp<
  ProfileParamList & CourierProfileParamList,
  'NotificationPreferences'
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const NotificationPreferences = ({ navigation }: Props) => {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux
  const { profile } = useProfile();
  const { notificationPreferences = [] } = profile;
  const flavor = useSelector(getFlavor);
  // state
  const [channelToConfirm, setChannelToConfirm] = React.useState<NotificationChannel>();
  // tracking
  useSegmentScreen('NotificationPreferences');
  // handlers
  const toggleNotificationPreference = (channel: NotificationChannel) => {
    api.profile().updateProfile(profile.id, {
      notificationPreferences: notificationPreferences.includes(channel)
        ? without(notificationPreferences, channel)
        : [...notificationPreferences, channel],
    });
    setChannelToConfirm(undefined);
  };
  // UI
  const channelsToConfirm: NotificationChannel[] = ['order-update', 'order-chat'];
  const text = (channel: NotificationChannel) => {
    if (channel === 'order-update') return t('Andamento do pedido');
    if (channel === 'order-chat') return t('Mensagens de chat durante o pedido');
    if (channel === 'status') return t('Comunicações operacionais');
    if (channel === 'general') return t('Comunicações institucionais');
    if (channel === 'marketing') return t('Promoções e ofertas');
    return '';
  };
  const createChannelCheckField = (channel: NotificationChannel) => {
    const description = (() => {
      if (channel === 'order-update')
        return t('Para acompanhar em tempo real das atualizações de status do seu pedido');
      if (channel === 'order-chat')
        return t('Para receber chats do restaurante ou entregador relacionadas ao seu pedido');
      if (channel === 'status')
        return t(
          'Para saber sobre novas versões, atualizações do app, atualização de novos recursos e mais'
        );
      if (channel === 'general')
        return t(
          'Para conhecer mais sobre o AppJusto: propósito, impacto, crescimento, financiamento e mais'
        );
      if (channel === 'marketing')
        return t(
          'Vamos te avisar quando tiver alguma promoção ou oferta referente aos restaurantes da nossa rede'
        );
      return '';
    })();
    const checked = profile.notificationPreferences?.includes(channel);
    const shouldConfirm = checked && channelsToConfirm.includes(channel);
    return (
      <>
        <CheckField
          checked={checked}
          text={text(channel)}
          onPress={() =>
            shouldConfirm ? setChannelToConfirm(channel) : toggleNotificationPreference(channel)
          }
        />
        <Text style={{ ...texts.xs, color: colors.green700, marginTop: halfPadding / 2 }}>
          {description}
        </Text>
      </>
    );
  };
  return (
    <ScrollView
      style={{ ...screens.config }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <PaddedView style={{ flex: 1 }}>
        <Text
          style={{
            ...texts.x2l,
            paddingBottom: halfPadding,
          }}
        >
          {t('Escolha as notificações que recebe do AppJusto')}
        </Text>
        <Text
          style={{
            ...texts.sm,
            color: colors.grey700,
            paddingBottom: halfPadding,
          }}
        >
          {t(
            'Para garantir a melhor experiência, as mensagens durante o pedido sempre são enviadas.'
          )}
        </Text>
        <View style={{ marginTop: biggerPadding }}>
          {/* <View>{createChannelCheckField('order-update')}</View>
          <View style={{ marginTop: padding }}>{createChannelCheckField('order-chat')}</View> */}
          <View>{createChannelCheckField('status')}</View>
          <View style={{ marginTop: padding }}>{createChannelCheckField('general')}</View>
          <View style={{ marginTop: padding }}>{createChannelCheckField('marketing')}</View>
        </View>
      </PaddedView>
      {channelToConfirm ? (
        <NotificationConfirmationModal
          title={`${t('Tem certeza que deseja desativar notificações de')} ${text(
            channelToConfirm
          ).toLocaleLowerCase()}?`}
          visible={!isEmpty(channelToConfirm)}
          onConfirm={() => toggleNotificationPreference(channelToConfirm)}
          onCancel={() => setChannelToConfirm(undefined)}
        />
      ) : null}
    </ScrollView>
  );
};
