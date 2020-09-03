import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { nanoid } from 'nanoid/non-secure';
import React, { useEffect, useContext, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';

import { motocycleWhite } from '../../../../assets/icons';
import useLocationUpdates from '../../../../hooks/useLocationUpdates';
import useNotificationToken from '../../../../hooks/useNotificationToken';
import { getCourier } from '../../../../store/courier/selectors';
import { CourierStatus } from '../../../../store/courier/types';
import { showToast } from '../../../../store/ui/actions';
import { updateProfile } from '../../../../store/user/actions';
import { t } from '../../../../strings';
import { ApiContext, AppDispatch } from '../../../app/context';
import { colors, padding, texts, borders } from '../../../common/styles';
import { HomeParamList } from './types';

const { width } = Dimensions.get('window');

type ScreenNavigationProp = StackNavigationProp<HomeParamList, 'Home'>;
type ScreenRouteProp = RouteProp<HomeParamList, 'Home'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();

  // app state
  const courier = useSelector(getCourier);
  const status = courier!.status;
  const working = status !== CourierStatus.Unavailable;

  // state
  const [locationKey, setLocationKey] = useState(nanoid());
  const locationPermission = useLocationUpdates(working, locationKey);
  const [notificationToken, notificationError] = useNotificationToken();

  // side effects
  // notification permission
  useEffect(() => {
    if (notificationError) {
      // TODO: ALERT
    } else if (notificationToken && notificationToken !== courier!.notificationToken) {
      updateProfile(api)(courier!.id!, { notificationToken });
    }
  }, [notificationToken, notificationError]);

  // location permission denied
  useEffect(() => {
    if (working && locationPermission === 'denied') {
      navigation.navigate('PermissionDeniedFeedback');
    }
  }, [working, locationPermission]);

  const toggleWorking = () => {
    if (status === CourierStatus.Dispatching) {
      dispatch(
        showToast(t('Você precisa finalizar a entrega antes de parar de trabalhar.'), 'error')
      );
      return;
    }
    const newStatus = working ? CourierStatus.Unavailable : CourierStatus.Available;
    if (newStatus === CourierStatus.Available) {
      setLocationKey(nanoid());
    }
    updateProfile(api)(courier!.id!, { status: newStatus });
  };

  // UI
  return (
    <SafeAreaView>
      {/* Main area */}
      <View style={[styles.main, { backgroundColor: working ? colors.green : colors.yellow }]}>
        <Text style={[texts.big, { paddingTop: 32, paddingBottom: 24 }]}>
          {`${t('Olá')}, ${courier?.name ?? 'entregador'}. ${t(
            'Faça suas corridas com segurança.'
          )}`}
        </Text>

        {/* controls */}
        <View style={styles.controls}>
          <View style={styles.controlItem}>
            <Image source={motocycleWhite} width={64} height={64} />
            <Text style={[texts.default, { paddingTop: 4 }]}>
              {t('Indisponível para corridas')}
            </Text>
            <Text style={[texts.small, { paddingTop: 8 }]}>
              {t('Mantenha ativado para aceitar corridas.')}
            </Text>
            <Switch
              trackColor={{ false: colors.white, true: colors.white }}
              thumbColor={working ? colors.green : colors.black}
              ios_backgroundColor={colors.white}
              onValueChange={toggleWorking}
              value={working}
            />
          </View>
          <View style={[styles.controlItem, { backgroundColor: colors.white }]}>
            <View style={[styles.priceTag]}>
              <Text style={[texts.small, { position: 'absolute', left: 6 }]}>{t('R$')}</Text>
              <Text style={[texts.huge]}>7</Text>
            </View>
            <Text style={[texts.default, { paddingTop: 4 }]}>
              {t('Valor mínimo da corrida na sua região')}
            </Text>
            <Text style={[texts.small, { paddingTop: 8 }]}>
              {t('Além disso, você ganha R$ 1,00 por quilômetro rodado.')}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  main: {
    padding,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlItem: {
    ...borders.default,
    borderColor: colors.white,
    width: Math.floor((width - 3 * padding) / 2),
    // height: Math.floor(height * 0.30),
    padding: 12,
  },
  priceTag: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.green,
    width: 74,
    height: 74,
    borderRadius: 37, // half of size
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
