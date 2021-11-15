import { Feather, Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import CheckField from '../../../../../common/components/buttons/CheckField';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import SingleHeader from '../../../../../common/components/texts/SingleHeader';
import HR from '../../../../../common/components/views/HR';
import { useReceivables } from '../../../../../common/store/api/courier/account/useReceivables';
import { useSegmentScreen } from '../../../../../common/store/api/track';
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
  // tracking
  useSegmentScreen('Receivables');
  // handlers
  const advanceHandler = () => {
    navigation.replace('AdvanceReceivables', { ids: selected });
  };
  // UI
  if (!receivables) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <ScrollView style={{ ...screens.config }}>
      <View>
        <PaddedView>
          <Text style={{ ...texts.sm }}>
            {t(
              'O AppJusto não fica com nada do valor do seu trabalho. Todas os pagamentos são processados com segurança pela operadora financeira Iugu.'
            )}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: padding,
              marginTop: 24,
            }}
          >
            <Feather name="info" size={14} />
            <Text style={{ ...texts.md, marginLeft: halfPadding }}>{t('Como funciona')}</Text>
          </View>
          <Text style={{ ...texts.sm, paddingBottom: halfPadding }}>
            {t(
              'O prazo padrão para processar os pagamentos é de 30 dias. Para antecipar, você paga uma taxa de até 2.5% por operação. Funciona assim: se for antecipar no primeiro dia útil após a corrida, você pagará o valor cheio de 2.5%, e a taxa diminui proporcionalmente a cada dia que passa. Se você esperar 15 dias, por exemplo, pagará 1.25%.'
            )}
          </Text>
        </PaddedView>

        <PaddedView>
          <PaddedView
            style={{
              backgroundColor: colors.white,
              ...borders.default,
              borderColor: colors.white,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="checkmark-circle-outline" size={20} color={colors.grey700} />
              <Text style={{ ...texts.sm, color: colors.grey700, marginLeft: halfPadding }}>
                {t('Disponível para adiantamento')}
              </Text>
            </View>
            <Text style={{ ...texts.x4l }}>{route.params.receivableBalance}</Text>
          </PaddedView>
        </PaddedView>
      </View>
      {!receivables ? <ActivityIndicator size="large" color={colors.green500} /> : null}
      {receivables && receivables.totalItems > 0 ? (
        <View>
          <SingleHeader
            style={{ backgroundColor: colors.white }}
            title={`${receivables.totalItems} ${t('corridas disponíveis.')}\n ${t(
              'Selecione as corridas que quiser antecipar:'
            )}`}
          />
          <PaddedView style={{ backgroundColor: colors.white }}>
            <CheckField
              checked={selected.length === receivables.totalItems}
              text={t('Selecionar todas')}
              onPress={() => setSelected(receivables.items.map((r) => r.id))}
            />
          </PaddedView>
          {receivables.items.map((item) => (
            <Pressable
              key={item.id}
              onPress={() =>
                setSelected((values) =>
                  values.includes(item.id)
                    ? values.filter((id) => id !== item.id)
                    : [...values, item.id]
                )
              }
            >
              <View style={{ flex: 1, backgroundColor: colors.grey50 }}>
                <PaddedView style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <CheckField checked={selected.includes(item.id)} />
                    <View style={{ marginLeft: halfPadding }}>
                      <Text style={{ ...texts.sm }}>{item.client_share}</Text>
                      <Text style={{ ...texts.sm, color: colors.grey500, marginTop: halfPadding }}>
                        {formatDate(new Date(item.scheduled_date))}
                      </Text>
                    </View>
                  </View>
                </PaddedView>
                <HR color={colors.grey500} />
              </View>
            </Pressable>
          ))}
          <PaddedView>
            <DefaultButton
              title={t('Avançar')}
              onPress={advanceHandler}
              disabled={selected.length === 0}
            />
          </PaddedView>
        </View>
      ) : null}
    </ScrollView>
  );
};
