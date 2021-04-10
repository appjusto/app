import { CourierStatus } from 'appjusto-types';
import { nanoid } from 'nanoid/non-secure';
import React from 'react';
import { Dimensions, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ApiContext, AppDispatch } from '../../../../common/app/context';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import ShowIf from '../../../../common/components/views/ShowIf';
import useLocationUpdates from '../../../../common/hooks/useLocationUpdates';
import useTallerDevice from '../../../../common/hooks/useTallerDevice';
import { IconMotocycleCentered } from '../../../../common/icons/icon-motocycle-centered';
import { getCourier, getShownLocationDisclosure } from '../../../../common/store/courier/selectors';
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

type Props = {
  onShowLocationDisclosure: () => void;
  onPermissionDenied: () => void;
  onFleetDetail: () => void;
};

const { width } = Dimensions.get('window');

export default function ({ onShowLocationDisclosure, onPermissionDenied, onFleetDetail }: Props) {
  // context
  const api = React.useContext(ApiContext);
  const dispatch = useDispatch<AppDispatch>();
  const tallerDevice = useTallerDevice();
  // redux
  const courier = useSelector(getCourier)!;
  const shownLocationDisclosure = useSelector(getShownLocationDisclosure);
  const status = courier!.status;
  const working = status !== undefined && status !== ('unavailable' as CourierStatus);

  // state
  const [locationKey, setLocationKey] = React.useState(nanoid());
  const locationPermission = useLocationUpdates(working, locationKey);

  // side effects
  // location permission handling
  React.useEffect(() => {
    if (locationPermission === 'denied') {
      onPermissionDenied();
    } else if (locationPermission === 'undetermined') {
      if (working && !shownLocationDisclosure) onShowLocationDisclosure();
    }
  }, [
    working,
    shownLocationDisclosure,
    locationPermission,
    onPermissionDenied,
    onShowLocationDisclosure,
  ]);

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
            {`${t('Olá')}, ${courier.name ?? 'entregador'}. ${t(
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
            <IconMotocycleCentered />
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
              <View style={{ marginTop: padding, alignItems: 'center' }}>
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
