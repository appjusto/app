import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import CheckField from '../../../../../common/components/buttons/CheckField';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import SingleHeader from '../../../../../common/components/texts/SingleHeader';
import HR from '../../../../../common/components/views/HR';
import { useReceivables } from '../../../../../common/store/api/courier/account/useReceivables';
import {
  borders,
  colors,
  halfPadding,
  padding,
  screens,
  texts,
} from '../../../../../common/styles';
import { formatDate } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';
import { DeliveriesNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<DeliveriesNavigatorParamList, 'Receivables'>;
type ScreenRoute = RouteProp<DeliveriesNavigatorParamList, 'Receivables'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

export const Receivables = ({ navigation, route }: Props) => {
  // state
  const [selected, setSelected] = React.useState<number[]>([]);
  // side effects
  const receivables = useReceivables();
  console.log(route.params.receivableBalance);
  // handlers
  const advanceHandler = () => navigation.replace('AdvanceReceivables', { ids: selected });
  // UI
  return (
    <View style={{ ...screens.config }}>
      <PaddedView>
        <Text style={{ ...texts.sm }}>
          {t('Você pode escolher individualmente os valores das corridas que deseja antecipar')}
        </Text>
        <Text style={{ ...texts.sm, marginTop: padding }}>
          {t(
            'Para realizar a antecipação, será cobrada uma taxa de 0.0% + R$ 0.00 pela operação financeira. Nada desse dinheiro não ficará com o AppJusto.'
          )}
        </Text>
        <PaddedView
          style={{
            marginTop: padding,
            backgroundColor: colors.white,
            ...borders.default,
            borderColor: colors.white,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ ...texts.sm, color: colors.grey700 }}>
              {t('Disponível para adiantamento')}
            </Text>
          </View>
          <Text style={{ ...texts.x4l }}>{route.params.receivableBalance}</Text>
        </PaddedView>
      </PaddedView>
      {!receivables ? <ActivityIndicator size="large" color={colors.green500} /> : null}
      {receivables && receivables.totalItems > 0 ? (
        <View>
          <SingleHeader
            style={{ backgroundColor: colors.white }}
            title={`${receivables.totalItems} ${t('corridas disponíveis.')}\n ${t(
              'Selecione as corridas que quiser antecipar:'
            )}`}
          />
          <FlatList
            data={receivables.items}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  setSelected((values) =>
                    values.includes(item.id)
                      ? values.filter((id) => id !== item.id)
                      : [...values, item.id]
                  )
                }
              >
                <View style={{ flex: 1, backgroundColor: colors.white }}>
                  <PaddedView style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                      <CheckField checked={selected.includes(item.id)} />
                      <View style={{ marginLeft: halfPadding }}>
                        <Text style={{ ...texts.sm }}>{item.client_share}</Text>
                        <Text
                          style={{ ...texts.sm, color: colors.grey500, marginTop: halfPadding }}
                        >
                          {formatDate(new Date(item.scheduled_date))}
                        </Text>
                      </View>
                    </View>
                  </PaddedView>
                  <HR color={colors.grey500} />
                </View>
              </Pressable>
            )}
            ListHeaderComponent={
              <PaddedView style={{ backgroundColor: colors.grey500 }}>
                <CheckField
                  checked={selected.length === receivables.totalItems}
                  text={t('Selecionar todas')}
                  onPress={() => setSelected(receivables.items.map((r) => r.id))}
                />
              </PaddedView>
            }
            ListFooterComponent={
              <PaddedView>
                <DefaultButton
                  title={t('Avançar')}
                  onPress={advanceHandler}
                  disabled={selected.length === 0}
                />
              </PaddedView>
            }
          />
        </View>
      ) : null}
    </View>
  );
};
