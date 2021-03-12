import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../common/app/context';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import RoundedText from '../../../common/components/texts/RoundedText';
import ShowIf from '../../../common/components/views/ShowIf';
import useObserveFleet from '../../../common/store/api/fleet/hooks/useObserveFleet';
import { getFlavor } from '../../../common/store/config/selectors';
import { getCourier } from '../../../common/store/courier/selectors';
import { colors, screens, texts } from '../../../common/styles';
import { formatCurrency, formatDistance } from '../../../common/utils/formatters';
import GainSimulator from '../../../courier/approved/main/profile/fleet/GainSimulator';
import { FleetNavigatorParamList } from '../../../courier/approved/main/profile/fleet/types';
import { t } from '../../../strings';
import { P2POrderNavigatorParamList } from '../p2p/types';

type P2PNavigatorProp = StackNavigationProp<P2POrderNavigatorParamList, 'FleetDetail'>;
type ScreenNavigationProp = P2PNavigatorProp;
type ScreenRouteProp = RouteProp<FleetNavigatorParamList, 'FleetDetail'>;

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
  //handlers
  // UI
  if (!fleet) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  // UI handlers
  const confirmFleet = async () => {
    api.profile().updateProfile(courier.id, { fleet });
    navigation.navigate('ChooseFleet', { fleetId: fleet.id });
  };

  const participants = `${fleet.participantsOnline} ${t('participantes')}`;
  const minFee = formatCurrency(fleet.minimumFee);
  const minDistance = formatDistance(fleet.distanceThreshold);
  const additionalPerKm = formatCurrency(fleet.additionalPerKmAfterThreshold);
  const maxDistance = formatDistance(fleet.maxDistance);
  const maxDistanceOrigin = formatDistance(fleet.maxDistanceToOrigin);

  return (
    <View style={[screens.config]}>
      <ScrollView>
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
              'Valor que os entregadores dessa frota receberão ao percorrer a Distância Inicial Mínima.'
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
              'Distância para o Pagamento Mínimo. Abaixo dessa distância, os entregadores dessa frota receberão o Pagamento Mínimo. Acima dessa distância, os entregadores receberão um Valor Adicional por Km Rodado.'
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
              'Valor adicional por Km que os entregadores dessa frota receberão ao percorrer uma distância acima da Distância Inicial Mínima.'
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
              'Distância máxima em Km que os entregadores dessa frota poderão percorrer para fazer uma entrega. Pedidos recebidos com distância máxima acima não serão exibidos.'
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
                {/* TO-DO: only used when choosing fleet;
                should be hidden when coming from home'Ver detalhes';
                should behave differently when coming from consumer
                 */}
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
    </View>
  );
}
