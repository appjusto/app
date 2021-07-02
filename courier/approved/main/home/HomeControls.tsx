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
import ShowIf from '../../../../common/components/views/ShowIf';
import useTallerDevice from '../../../../common/hooks/useTallerDevice';
import { IconMotocycleCentered } from '../../../../common/icons/icon-motocycle-centered';
import { getCourier } from '../../../../common/store/courier/selectors';
import { showToast } from '../../../../common/store/ui/actions';
import { updateProfile } from '../../../../common/store/user/actions';
import {
  borders,
  colors,
  doublePadding,
  halfPadding,
  padding,
  texts,
} from '../../../../common/styles';
import { formatCurrency, formatDistance } from '../../../../common/utils/formatters';
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
  const tallerDevice = useTallerDevice();
  // redux store
  const courier = useSelector(getCourier)!;
  const status = courier!.status;
  const working = status !== undefined && status !== ('unavailable' as CourierStatus);
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
      <ShowIf test={tallerDevice}>
        {() => (
          <Text
            style={[
              texts.x2l,
              {
                // paddingBottom: tallerDevice ? padding : padding,
                // marginTop: tallerDevice ? padding : 0,
              },
            ]}
          >
            {`${t('Olá')}, ${courier.name ?? 'entregador/a'}. ${t(
              'Faça suas corridas com segurança.'
            )}`}
          </Text>
        )}
      </ShowIf>

      {/* controls */}
      <View>
        <Text style={{ marginBottom: 4, marginTop: halfPadding }}>ID: #{courier.code}</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: tallerDevice ? doublePadding : halfPadding,
          }}
        >
          <View style={styles.controlItem}>
            {working ? <IconMotocycleCentered flipped /> : <IconMotocycleCentered />}
            <Text style={[texts.sm, { paddingTop: 4 }]}>
              {working ? t('Disponível para corridas') : t('Indisponível para corridas')}
            </Text>
            <Text style={[texts.xs, { paddingTop: halfPadding }]}>
              {t('Mantenha ativado para aceitar corridas.')}
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
