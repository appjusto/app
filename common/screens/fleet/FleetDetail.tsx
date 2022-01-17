import { CourierFleet } from '@appjusto/types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import firebase from 'firebase/compat';
import { omit } from 'lodash';
import React, { useContext } from 'react';
import { ActivityIndicator, Keyboard, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RestaurantNavigatorParamList } from '../../../consumer/v2/food/restaurant/types';
import { P2POrderNavigatorParamList } from '../../../consumer/v2/p2p/types';
import GainSimulator from '../../../courier/approved/main/profile/fleet/GainSimulator';
import { CourierProfileParamList } from '../../../courier/approved/main/profile/types';
import { t } from '../../../strings';
import { ApiContext } from '../../app/context';
import DefaultButton from '../../components/buttons/DefaultButton';
import PaddedView from '../../components/containers/PaddedView';
import RoundedText from '../../components/texts/RoundedText';
import ShowIf from '../../components/views/ShowIf';
import useObserveFleet from '../../store/api/fleet/hooks/useObserveFleet';
import { track, useSegmentScreen } from '../../store/api/track';
import { getFlavor } from '../../store/config/selectors';
import { getCourier } from '../../store/courier/selectors';
import { colors, screens, texts } from '../../styles';
import { formatCurrency, formatDistance } from '../../utils/formatters';

export type FleetDetailParamList = {
  FleetDetail: {
    fleetId: string;
  };
};

type ScreenNavigationProp = StackNavigationProp<
  P2POrderNavigatorParamList & RestaurantNavigatorParamList & CourierProfileParamList,
  'FleetDetail'
>;
type ScreenRouteProp = RouteProp<FleetDetailParamList, 'FleetDetail'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // params
  const { fleetId } = route.params;
  //context
  const api = useContext(ApiContext);
  // app state
  const courier = useSelector(getCourier)!;
  const flavor = useSelector(getFlavor);
  // state
  const fleet = useObserveFleet(fleetId);
  // side effects
  // tracking
  useSegmentScreen('FleetDetail', { fleetId });
  // UI
  if (!fleet) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // handlers
  const confirmFleet = () => {
    Keyboard.dismiss();
    track('Changed fleet', {
      current: courier.fleet,
      new: fleet,
    });
    api
      .profile()
      .updateProfile(courier.id, {
        fleet: {
          ...(omit(fleet, ['partipantsOnline', 'situation']) as CourierFleet),
          joinedOn: firebase.firestore.FieldValue.serverTimestamp(),
        },
      })
      .then(null);
    navigation.navigate('ChooseFleet');
  };
  // UI
  const participants = `${fleet.participantsOnline} ${t('participantes')}`;
  const minFee = formatCurrency(fleet.minimumFee);
  const minDistance = formatDistance(fleet.distanceThreshold);
  const additionalPerKm = formatCurrency(fleet.additionalPerKmAfterThreshold);
  const maxDistance = formatDistance(fleet.maxDistance);
  const maxDistanceOrigin = formatDistance(fleet.maxDistanceToOrigin);
  return (
    <ScrollView
      style={{ ...screens.config }}
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <PaddedView>
        <Text style={[texts.x2l]}>{fleet.name}</Text>
        <Text style={{ ...texts.xs, color: colors.green600, marginTop: 8 }}>{participants}</Text>
        <Text style={{ ...texts.xs, color: colors.grey700, marginTop: 8 }}>
          {fleet.description}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 32,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ ...texts.md }}>{t('Pagamento Mínimo')}</Text>
          <RoundedText>{minFee}</RoundedText>
        </View>
        <Text style={{ ...texts.sm, color: colors.grey700, marginTop: 8 }}>
          {t(
            'Valor que entregadores/as dessa frota receberão ao percorrer a Distância Inicial Mínima.'
          )}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 32,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ ...texts.md }}>{t('Distância Inicial Mínima')}</Text>
          <RoundedText>{minDistance}</RoundedText>
        </View>
        <Text style={{ ...texts.sm, color: colors.grey700, marginTop: 8 }}>
          {t(
            'Distância para o Pagamento Mínimo. Abaixo dessa distância, entregadores/as dessa frota receberão o Pagamento Mínimo. Acima dessa distância, entregadores/as receberão um Valor Adicional por Km Rodado.'
          )}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 32,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ ...texts.md }}>{t('Valor Adicional por Km Rodado')}</Text>
          <RoundedText>{additionalPerKm}</RoundedText>
        </View>
        <Text style={{ ...texts.sm, color: colors.grey700, marginTop: 8 }}>
          {t(
            'Valor adicional por Km que entregadores/as dessa frota receberão ao percorrer uma distância acima da Distância Inicial Mínima.'
          )}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 32,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ ...texts.md }}>{t('Distância Máxima para Entrega')}</Text>
          <RoundedText>{maxDistance}</RoundedText>
        </View>
        <Text style={{ ...texts.sm, color: colors.grey700, marginTop: 8 }}>
          {t(
            'Distância máxima em Km que entregadores/as dessa frota poderão percorrer para fazer uma entrega. Pedidos recebidos com distância máxima acima não serão exibidos.'
          )}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 32,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ ...texts.md }}>{t('Distância Máxima até a Origem')}</Text>
          <RoundedText>{maxDistanceOrigin}</RoundedText>
        </View>
        <Text style={{ ...texts.sm, color: colors.grey700, marginTop: 8 }}>
          {t(
            'Distância máxima em km da posição atual até a origem do pedido que essa frota poderá percorrer. Pedidos recebidos com origem acima não serão exibidos.'
          )}
        </Text>
      </PaddedView>
      <ShowIf test={flavor === 'courier'}>
        {() => (
          <>
            <GainSimulator
              fee={fleet.minimumFee}
              distance={fleet.distanceThreshold}
              additional={fleet.additionalPerKmAfterThreshold}
            />
            <PaddedView>
              {courier.fleet!.id !== fleet.id && (
                <DefaultButton
                  title={t('Ingressar nessa frota')}
                  onPress={confirmFleet}
                  style={{ marginTop: 16 }}
                />
              )}
            </PaddedView>
          </>
        )}
      </ShowIf>
    </ScrollView>
  );
}
