import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import { getCourier } from '../../../../../common/store/courier/selectors';
import { colors, padding, screens, texts } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { CourierFleetCard } from './components/CourierFleetCard';
import { FleetParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<FleetParamList, 'ChooseFleet'>;
type ScreenRouteProp = RouteProp<FleetParamList, 'ChooseFleet'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation, route }: Props) {
  // redux store
  const courier = useSelector(getCourier)!;

  // handlers
  // const confirmFleet = useCallback(async () => {
  //   if (!selectedFleet) return;
  //   api.profile().updateProfile(courier.id, { fleet: selectedFleet });
  //   navigation.goBack();
  // }, [selectedFleet]);
  // UI
  if (!courier.fleet) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  return (
    <ScrollView style={{ ...screens.config }}>
      <View style={{ flex: 1 }}>
        <PaddedView>
          <Text style={{ ...texts.big, marginBottom: padding }}>{t('Sua frota atual')}</Text>
          <Text
            style={{
              ...texts.default,
              color: colors.darkGrey,
              marginBottom: 24,
            }}
          >
            {t('Você está nessa frota desde 00/00/0000')}
          </Text>
          <CourierFleetCard fleet={courier.fleet} />
          <View style={{ marginTop: 24 }}>
            <DefaultButton
              title={t('Veja todas as frotas disponíveis')}
              onPress={() => navigation.navigate('AllFleets')}
            />
            <DefaultButton
              style={{ marginTop: padding }}
              title={t('Criar uma nova frota')}
              onPress={() => navigation.navigate('CreateFleet')}
              secondary
            />
          </View>
        </PaddedView>
        {/* <HR color={colors.grey} /> */}
        {/* <PaddedView>
          <ShowIf test={fleets === undefined}>
            {() => <ActivityIndicator size="large" color={colors.black} />}
          </ShowIf>
          <ShowIf test={Boolean(fleets?.length)}>
            {() => (
              <Text style={{ ...texts.mediumToBig }}>{t('Frotas com mais participantes: ')}</Text>
            )}
          </ShowIf>
        </PaddedView> */}
      </View>
      {/* <FlatList
        data={fleets}
        renderItem={({ item }) => {
          return (
            <PaddedView>
              <FleetCard
                fleet={item}
                selected={item.id === selectedFleet?.id}
                couriersFleet={item.id === courier.fleet?.id}
                onSelect={() => setSelectedFleet(item)}
                onConfirm={confirmFleet}
              />
            </PaddedView>
          );
        }}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={{ flex: 1 }}>
            <PaddedView>
              <Text
                style={{
                  ...texts.default,
                  color: colors.darkGrey,
                  marginBottom: 24,
                }}
              >
                {t(
                  'Faça parte de uma frota existente ou crie sua própria frota. Frotas com mais participantes tem mais chances de corridas melhores.'
                )}
              </Text>
              <DefaultButton
                title={t('Veja todas as frotas disponíveis')}
                onPress={() => navigation.navigate('AllFleets')}
              />
              <DefaultButton
                style={{ marginTop: padding }}
                title={t('Criar uma nova frota')}
                onPress={() => navigation.navigate('CreateFleet')}
                secondary
              />
            </PaddedView>
            <HR color={colors.grey} />
            <PaddedView>
              <ShowIf test={fleets === undefined}>
                {() => <ActivityIndicator size="large" color={colors.black} />}
              </ShowIf>
              <ShowIf test={Boolean(fleets?.length)}>
                {() => (
                  <Text style={{ ...texts.mediumToBig }}>
                    {t('Frotas com mais participantes: ')}
                  </Text>
                )}
              </ShowIf>
            </PaddedView>
          </View>
        }
        onEndReached={() => fetchNextPage()}
      /> */}
    </ScrollView>
  );
}
