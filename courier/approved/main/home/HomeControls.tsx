import { CourierStatus } from '@appjusto/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import Constants from 'expo-constants';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import { IconMotocycleCentered } from '../../../../common/icons/icon-motocycle-centered';
import useObserveFleet from '../../../../common/store/api/fleet/hooks/useObserveFleet';
import { useProfileSummary } from '../../../../common/store/api/profile/useProfileSummary';
import { getCourier } from '../../../../common/store/courier/selectors';
import { showToast } from '../../../../common/store/ui/actions';
import { updateProfile } from '../../../../common/store/user/actions';
import { borders, colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import {
  formatCurrency,
  formatDate,
  formatDistance,
  formatTime,
} from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import { ApprovedParamList } from '../../types';
import { MainParamList } from '../types';
import { ModalChooser } from './ModalChooser';

type ScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainParamList, 'Home'>,
  StackNavigationProp<ApprovedParamList, 'MainNavigator'>
>;

type Props = {
  onFleetDetail: (fleetId: string) => void;
};

const { width } = Dimensions.get('window');

export default function ({ onFleetDetail }: Props) {
  // context
  const navigation = useNavigation<ScreenNavigationProp>();
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  // redux store
  const courier = useSelector(getCourier)!;
  const { status } = courier;
  const working = status === 'available';
  // state
  const fleet = useObserveFleet(courier.fleetsIds?.find(() => true));
  const { shouldVerifyPhone } = useProfileSummary();
  const [modalVisible, setModalVisible] = React.useState(false);
  // handlers
  const toggleWorking = () => {
    if (status === 'inactive') return;
    if (status === 'dispatching') {
      Keyboard.dismiss();
      dispatch(
        showToast(t('Você precisa finalizar a entrega antes de parar de trabalhar.'), 'error')
      );
      return;
    }
    const newStatus: CourierStatus = working ? 'unavailable' : 'available';
    if (
      Constants.appOwnership !== 'expo' &&
      !courier.notificationToken &&
      newStatus === 'available'
    ) {
      navigation.navigate('PermissionDenied', {
        title: t('Precisamos de permissão para te enviar mensagens'),
        subtitle: t('Clique no botão abaixo para acessar as configurações do seu dispositivo.'),
      });
    }
    dispatch(updateProfile(api)(courier.id, { status: newStatus }));
    if (newStatus === 'available' && !shouldVerifyPhone) setModalVisible(true);
  };

  // UI
  const getBackgroundColor = () => {
    if (status === 'inactive') return colors.grey500;
    if (working) return colors.green500;
    return colors.darkYellow;
  };

  return (
    <View>
      <PaddedView style={[{ backgroundColor: getBackgroundColor() }]}>
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
                {working && courier.updatedOn
                  ? `${t('Última atualização:')} ${formatDate(courier.updatedOn)} ${formatTime(
                      courier.updatedOn
                    )}`
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
              {fleet ? (
                <View>
                  <Text
                    style={{
                      ...texts.sm,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}
                  >
                    {t('Frota')} {fleet?.name}
                  </Text>
                  <View style={[styles.priceTag]}>
                    <Text style={[texts.xs]}>{t('R$')}</Text>
                    <Text style={[texts.x40l]}>
                      {formatCurrency(fleet?.minimumFee ?? 0, {
                        unit: '',
                        strip_insignificant_zeros: false,
                      })}
                    </Text>
                  </View>
                  <Text style={[texts.xs, { marginTop: padding, color: colors.grey700 }]}>
                    {`+ ${formatCurrency(fleet?.additionalPerKmAfterThreshold ?? 0)} km/adicional`}
                  </Text>
                  <Text style={[texts.xs, { color: colors.grey700 }]}>
                    {t('Distância mínima')} {formatDistance(fleet!.distanceThreshold)}
                  </Text>
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity onPress={() => onFleetDetail(fleet.id)}>
                    <View style={{ marginTop: padding, alignItems: 'flex-start' }}>
                      <RoundedText>{t('Mudar de frota')}</RoundedText>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={screens.centered}>
                  <ActivityIndicator size="small" color={colors.green500} />
                </View>
              )}
            </View>
          </View>
        </View>
      </PaddedView>
      <ModalChooser modalVisible={modalVisible} onPress={() => setModalVisible(false)} />
    </View>
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
