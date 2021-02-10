import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CourierStatus } from 'appjusto-types';
import { nanoid } from 'nanoid/non-secure';
import React from 'react';
import { Dimensions, Image, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as icons from '../../../../assets/icons';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import ShowIf from '../../../../common/components/views/ShowIf';
import useLocationUpdates from '../../../../common/hooks/useLocationUpdates';
import useTallerDevice from '../../../../common/hooks/useTallerDevice';
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
import { HomeParamList } from './types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<HomeParamList, 'Home'>,
  CompositeNavigationProp<
    BottomTabNavigationProp<MainParamList, 'HomeNavigator'>,
    StackNavigationProp<ApprovedParamList, 'MainNavigator'>
  >
>;

type Props = {
  navigation: ScreenNavigationProp;
};

const { width } = Dimensions.get('window');

export default function ({ navigation }: Props) {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const tallerDevice = useTallerDevice();

  // app state
  const courier = useSelector(getCourier)!;
  const status = courier!.status;
  const working = status !== undefined && status !== ('unavailable' as CourierStatus);

  // state
  const [locationKey, setLocationKey] = React.useState(nanoid());
  const locationPermission = useLocationUpdates(working, locationKey);

  // side effects
  // location permission denied
  React.useEffect(() => {
    if (working && locationPermission === 'denied') {
      navigation.navigate('PermissionDeniedFeedback', {
        title: t('Precisamos acessar a localização do seu dispositivo'),
        subtitle: t(
          'Para que possamos determinar o trajeto das corridas, precisamos que você dê acesso ao AppJusto para usar a localização do seu dispositivo.'
        ),
      });
      // removing previous token
      dispatch(updateProfile(api)(courier!.id!, { notificationToken: null }));
    }
  }, [working, locationPermission]);

  // handlers
  const toggleWorking = () => {
    if (status === 'dispatching') {
      dispatch(
        showToast(t('Você precisa finalizar a entrega antes de parar de trabalhar.'), 'error')
      );
      return;
    }
    const newStatus: CourierStatus = working ? 'unavailable' : 'available';
    if (newStatus === 'available') {
      setLocationKey(nanoid());
    }
    dispatch(updateProfile(api)(courier.id, { status: newStatus }));
  };

  // UI
  return (
    <PaddedView style={[{ backgroundColor: working ? colors.green : colors.darkYellow }]}>
      <ShowIf test={tallerDevice}>
        {() => (
          <Text
            style={[
              texts.big,
              {
                paddingBottom: tallerDevice ? doublePadding : padding,
                marginTop: tallerDevice ? doublePadding : 0,
              },
            ]}
          >
            {`${t('Olá')}, ${courier.name ?? 'entregador'}. ${t(
              'Faça suas corridas com segurança.'
            )}`}
          </Text>
        )}
      </ShowIf>

      {/* controls */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: tallerDevice ? doublePadding : halfPadding,
        }}
      >
        <View style={styles.controlItem}>
          <Image source={icons.motocycleWhite} width={64} height={64} />
          <Text style={[texts.default, { paddingTop: 4 }]}>
            {working ? t('Disponível para corridas') : t('Indisponível para corridas')}
          </Text>
          <Text style={[texts.small, { paddingTop: halfPadding }]}>
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
              thumbColor={working ? colors.green : colors.black}
              ios_backgroundColor={colors.white}
              onValueChange={toggleWorking}
              value={working}
            />
          </View>
        </View>
        <View style={[styles.controlItem, { backgroundColor: colors.white }]}>
          <Text
            style={{
              ...texts.default,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            {t('Frota')} {courier.fleet?.name}
          </Text>
          <View style={[styles.priceTag]}>
            <Text style={[texts.small]}>{t('R$')}</Text>
            <Text style={[texts.huge]}>
              {formatCurrency(courier.fleet?.minimumFee ?? 0, {
                unit: '',
                strip_insignificant_zeros: false,
              })}
            </Text>
          </View>
          <Text style={[texts.small, { marginTop: padding, color: colors.darkGrey }]}>
            {`+ ${formatCurrency(courier.fleet?.additionalPerKmAfterThreshold ?? 0)} km/adicional`}
          </Text>
          <Text style={[texts.small, { color: colors.darkGrey }]}>
            {t('Distância mínima')} {formatDistance(courier.fleet!.distanceThreshold)}
          </Text>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('FleetNavigator', {
                screen: 'ChooseFleet',
                fleetId: courier.fleet!.id,
              })
            }
            // onPress={() => navigation.navigate('FleetDetail', { fleetId: courier.fleet!.id })}
          >
            <View style={{ marginTop: padding, alignItems: 'center' }}>
              <RoundedText>{t('Mudar de frota')}</RoundedText>
            </View>
          </TouchableOpacity>
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
