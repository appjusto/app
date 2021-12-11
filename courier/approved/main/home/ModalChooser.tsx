import { CourierMode } from '@appjusto/types';
import React, { useContext } from 'react';
import { Modal, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../../../assets/icons';
import { ApiContext } from '../../../../common/app/context';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import IconButton from '../../../../common/components/buttons/IconButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import { getCourier } from '../../../../common/store/courier/selectors';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

type Props = {
  modalVisible: boolean;
  onPress: () => void;
};

export const ModalChooser = ({ modalVisible, onPress }: Props) => {
  // context
  const api = useContext(ApiContext);
  // redux store
  const courier = useSelector(getCourier)!;
  const { mode } = courier;

  // side effects
  React.useEffect(() => {
    if (!mode) api.profile().updateProfile(courier.id, { mode: 'motorcycle' }).then(null);
  }, []);
  // UI handlers
  const modeChangeHandler = (value: CourierMode) => {
    api.profile().updateProfile(courier.id, { mode: value }).then(null);
  };

  // UI
  return (
    <Modal transparent visible={modalVisible}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
        <PaddedView
          style={{ ...borders.default, backgroundColor: colors.white, borderColor: colors.grey50 }}
        >
          <Text style={[texts.md, { paddingTop: halfPadding }]}>
            {t('Como você vai fazer suas entregas hoje?')}
          </Text>
          <View
            style={{
              marginTop: padding,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: padding,
            }}
          >
            <IconButton
              title={t('Moto')}
              active={mode === 'motorcycle'}
              onPress={() => modeChangeHandler('motorcycle')}
              icon={icons.motoSmall}
            />
            <IconButton
              title={t('Bicicleta')}
              active={mode === 'bicycling'}
              onPress={() => modeChangeHandler('bicycling')}
              icon={icons.bikeSmall}
            />
            <IconButton
              title={t('Patinete')}
              active={mode === 'scooter'}
              onPress={() => modeChangeHandler('scooter')}
              icon={icons.scooterSmall}
            />
            <IconButton
              title={t('Carro')}
              active={mode === 'car'}
              onPress={() => modeChangeHandler('car')}
              icon={icons.carSmall}
            />
            <IconButton
              title={t('A pé')}
              active={mode === 'walking'}
              onPress={() => modeChangeHandler('walking')}
              icon={icons.onFootSmall}
            />
          </View>
          <DefaultButton title={t('Continuar')} style={{ marginTop: padding }} onPress={onPress} />
        </PaddedView>
      </View>
    </Modal>
  );
};
