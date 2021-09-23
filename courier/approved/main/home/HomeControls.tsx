import { CourierStatus } from '@appjusto/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import { IconMotocycleCentered } from '../../../../common/icons/icon-motocycle-centered';
import { getCourier } from '../../../../common/store/courier/selectors';
import { showToast } from '../../../../common/store/ui/actions';
import { updateProfile } from '../../../../common/store/user/actions';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import {
  formatCurrency,
  formatDate,
  formatDistance,
  formatTime,
} from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import { ApprovedParamList } from '../../types';
import { MainParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainParamList, 'Home'>,
  StackNavigationProp<ApprovedParamList, 'MainNavigator'>
>;

type Props = {
  onFleetDetail: () => void;
};

const { width } = Dimensions.get('window');

export default function ({ onFleetDetail }: Props) {
  // context
  const navigation = useNavigation<ScreenNavigationProp>();
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const courier = useSelector(getCourier)!;
  const status = courier!.status;
  const working = status !== undefined && status !== ('unavailable' as CourierStatus);
  const [updatedOn, setUpdatedOn] = React.useState(courier.updatedOn);
  // side effects
  React.useEffect(() => {
    if (courier.updatedOn) setUpdatedOn(courier.updatedOn);
  }, [courier.updatedOn]);
  // handlers
  const toggleWorking = () => {
    if (status === 'dispatching') {
      dispatch(
        showToast(t('Você precisa finalizar a entrega antes de parar de trabalhar.'), 'error')
      );
      return;
    }
    const newStatus: CourierStatus = working ? 'unavailable' : 'available';
    if (!courier.notificationToken && newStatus === 'available') {
      navigation.navigate('PermissionDenied', {
        title: t('Precisamos de permissão para te enviar mensagens'),
        subtitle: t('Clique no botão abaixo para acessar as configurações do seu dispositivo.'),
      });
      return;
    }
    dispatch(updateProfile(api)(courier.id, { status: newStatus }));
  };

  // UI
  return (
    <PaddedView style={[{ backgroundColor: working ? colors.green500 : colors.darkYellow }]}>
      <Text
        style={[
          texts.x2l,
          {
            paddingBottom: halfPadding,
            paddingTop: halfPadding,
          },
        ]}
      >
        {`${t('Olá')}, ${courier.name ?? 'entregador/a'}. ${t(
          'Faça suas corridas com segurança.'
        )}`}
      </Text>
      {/* controls */}
      <View>
        <Text style={{ marginBottom: 4 }}>ID: #{courier.code}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View style={styles.controlItem}>
            {working ? <IconMotocycleCentered flipped /> : <IconMotocycleCentered />}
            <Text style={[texts.sm, { paddingTop: 4 }]}>
              {working ? t('Disponível para corridas') : t('Indisponível para corridas')}
            </Text>
            <Text style={[texts.xs, { paddingTop: halfPadding }]}>
              {updatedOn
                ? `${t('Última atualização:')} ${formatDate(updatedOn)} ${formatTime(updatedOn)}`
                : t('Mantenha ativado para aceitar corridas.')}
            </Text>
            <View
              style={{
                ...borders.default,
                backgroundColor: colors.white,
                marginTop: padding,
                borderColor: colors.black,
                borderWidth: 2,
                borderRadius: 32,
                alignSelf: 'flex-start',
              }}
            >
              <Switch
                style={{ alignSelf: 'flex-start' }}
                trackColor={{ false: colors.white, true: colors.white }}
                thumbColor={working ? colors.green500 : colors.black}
                ios_backgroundColor={colors.white}
                onValueChange={toggleWorking}
                value={working}
              />
            </View>
          </View>
          <View style={[styles.controlItem, { backgroundColor: colors.white }]}>
            <Text
              style={{
                ...texts.sm,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              {t('Frota')} {courier.fleet?.name}
            </Text>
            <View style={[styles.priceTag]}>
              <Text style={[texts.xs]}>{t('R$')}</Text>
              <Text style={[texts.x40l]}>
                {formatCurrency(courier.fleet?.minimumFee ?? 0, {
                  unit: '',
                  strip_insignificant_zeros: false,
                })}
              </Text>
            </View>
            <Text style={[texts.xs, { marginTop: padding, color: colors.grey700 }]}>
              {`+ ${formatCurrency(
                courier.fleet?.additionalPerKmAfterThreshold ?? 0
              )} km/adicional`}
            </Text>
            <Text style={[texts.xs, { color: colors.grey700 }]}>
              {t('Distância mínima')} {formatDistance(courier.fleet!.distanceThreshold)}
            </Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => onFleetDetail()}>
              <View style={{ marginTop: padding, alignItems: 'flex-start' }}>
                <RoundedText>{t('Mudar de frota')}</RoundedText>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </PaddedView>
  );
}

const styles = StyleSheet.create({
  controlItem: {
    ...borders.default,
    borderColor: colors.white,
    width: Math.floor((width - 3 * padding) / 2),
    // height: Math.floor(height * 0.30),
    padding: 12,
  },
  priceTag: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
