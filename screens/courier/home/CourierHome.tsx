import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, Dimensions, Text, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';

import { motocycleWhite } from '../../../assets/icons';
import useLocationUpdates from '../../../hooks/useLocationUpdates';
import useNotification from '../../../hooks/useNotification';
import useNotificationToken from '../../../hooks/useNotificationToken';
import { updateCourier, watchCourier } from '../../../store/courier/actions';
import { isCourierWorking, getCourierLocation } from '../../../store/courier/selectors';
import { CourierStatus } from '../../../store/courier/types';
import { getUser } from '../../../store/selectors/user';
import { t } from '../../../strings';
import { ApiContext, AppDispatch } from '../../app/context';
import { colors, padding, texts, borders } from '../../common/styles';

const { width, height } = Dimensions.get('window');

export default function App() {
  // context
  const dispatch = useDispatch<AppDispatch>();
  const api = useContext(ApiContext);

  // state
  const [notificationToken, notificationError] = useNotificationToken();
  useNotification();
  const user = useSelector(getUser);
  const working = useSelector(isCourierWorking);
  const locationPermission = useLocationUpdates(working);
  const currentLocation = useSelector(getCourierLocation);

  // side effects
  // location permission granted
  useEffect(() => {
    if (locationPermission === 'granted') {
      // TO-DO: send current location?
    } else {
      // TODO: Linking.openURL('app-settings:')
      // Linking.openURL('app-settings://notification/<bundleIdentifier>')
      // IntentLauncher.startActivityAsync(IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS);
    }
  }, [locationPermission]);

  // notification permission
  useEffect(() => {
    if (notificationError) {
      // TODO: ALERT
    } else if (notificationToken) {
      updateCourier(api)(user!.uid, { notificationToken });
    }
  }, [notificationToken, notificationError]);

  // watch for profile updates
  useEffect(() => {
    if (!user) return;
    return dispatch(watchCourier(api)(user.uid));
  }, [user]);

  // handlers
  const toggleWorking = () => {
    const status = working ? CourierStatus.Unavailable : CourierStatus.Available;
    updateCourier(api)(user!.uid, { status });
  };

  // UI
  return (
    <SafeAreaView>
      {/* Main area */}
      <View style={[style.main, { backgroundColor: working ? colors.green : colors.yellow }]}>
        <Text style={[texts.big, { paddingTop: 32, paddingBottom: 24 }]}>
          {t('Olá, João Paulo. Faça suas corridas com segurança.')}
        </Text>

        {/* controls */}
        <View style={style.controls}>
          <View style={style.controlItem}>
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
          <View style={[style.controlItem, { backgroundColor: colors.white }]}>
            <View style={[style.priceTag]}>
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
const style = StyleSheet.create({
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
