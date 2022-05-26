import { IuguMarketplaceAccountReceivableItem } from '@appjusto/types/payment/iugu';
import { Feather, Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';
import React from 'react';
import { ActivityIndicator, Pressable, SectionList, Text, View } from 'react-native';
import CheckField from '../../../../../common/components/buttons/CheckField';
import DefaultButton from '../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import SingleHeader from '../../../../../common/components/texts/SingleHeader';
import { usePlatformParamsContext } from '../../../../../common/contexts/PlatformParamsContext';
import { useContextGetSeverTime } from '../../../../../common/contexts/ServerTimeContext';
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
import { formatDate, formatTime } from '../../../../../common/utils/formatters';
import { t } from '../../../../../strings';
import { DeliveriesNavigatorParamList } from '../types';
import { useCanAdvanceReceivables } from './useCanAdvanceReceivables';

type ScreenNavigationProp = StackNavigationProp<DeliveriesNavigatorParamList, 'Receivables'>;
type ScreenRoute = RouteProp<DeliveriesNavigatorParamList, 'Receivables'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

interface Section {
  advanceable: boolean;
  data: IuguMarketplaceAccountReceivableItem[];
}

export const Receivables = ({ navigation, route }: Props) => {
  // context
  const getServerTime = useContextGetSeverTime();
  const advanceableAfterHours = usePlatformParamsContext()?.courier.advanceableAfterHours ?? 48;
  // state
  const receivables = useReceivables();
  const canAdvanceReceivables = useCanAdvanceReceivables();
  const [selected, setSelected] = React.useState<number[]>([]);
  const [advanceables, setAdavanceables] = React.useState<number[]>([]);
  const [sections, setSections] = React.useState<Section[]>();
  // helpers
  const advanceableAt = (createdAt: string) =>
    dayjs(new Date(createdAt)).add(advanceableAfterHours, 'hour').toDate();
  // side effects
  useSegmentScreen('Receivables');
  React.useEffect(() => {
    if (!receivables) return;
    setAdavanceables(
      receivables.items
        .filter((item) => dayjs(advanceableAt(item.created_at)).isBefore(getServerTime()))
        .map((item) => item.id)
    );
  }, [receivables]);
  React.useEffect(() => {
    if (!advanceables) return;
    setSections([
      {
        advanceable: true,
        data: receivables ? receivables.items.filter((item) => advanceables.includes(item.id)) : [],
      },
      {
        advanceable: false,
        data: receivables
          ? receivables.items.filter((item) => !advanceables.includes(item.id))
          : [],
      },
    ]);
  }, [advanceables]);
  // handlers
  const advanceHandler = () => {
    navigation.replace('AdvanceReceivables', { ids: selected });
  };
  // UI
  if (!receivables || !sections) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <SectionList
      scrollIndicatorInsets={{ right: 1 }}
      style={{ flex: 1 }}
      keyExtractor={(item) => `${item.id}`}
      sections={sections}
      ListHeaderComponent={
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
                'O prazo padrão para processar os pagamentos é de 30 dias. Para antecipar, você paga uma taxa de até 1.99% por operação. Funciona assim: se for antecipar no primeiro dia útil após a corrida, você pagará o valor cheio de 1.99%, e a taxa diminui proporcionalmente a cada dia que passa. Se você esperar 15 dias, por exemplo, pagará 0.99%.'
              )}
            </Text>
            <Text style={{ ...texts.sm, color: colors.red }}>
              {t(
                'Atenção: a Iugu só permite realizar antecipações em dias úteis, de 09:00 às 16:00 e só é possível antecipar faturas pagas a mais de 2 dias.'
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
                  {t('Total à receber')}
                </Text>
              </View>
              <Text style={{ ...texts.x4l }}>{route.params.receivableBalance}</Text>
            </PaddedView>
          </PaddedView>
        </View>
      }
      renderSectionHeader={({ section }) => {
        const empty = section.data.length === 0;
        // const titlePrefix = `${
        //   empty ? t('Nenhuma corrida disponível') : `${section.data.length} ${t('corridas disponíveis')}`
        // }`;
        return (
          <View>
            <SingleHeader
              style={{ backgroundColor: colors.white }}
              title={`${
                section.advanceable ? t('Corridas antecipáveis') : t('Corridas em processamento')
              }`}
            />
            {!empty ? (
              section.advanceable ? (
                <PaddedView half style={{ marginBottom: halfPadding }}>
                  <CheckField
                    checked={selected.length === receivables.totalItems}
                    text={t('Selecionar todas')}
                    onPress={() => setSelected(advanceables)}
                  />
                </PaddedView>
              ) : null
            ) : (
              <PaddedView half>
                <Text style={{ ...texts.sm }}>
                  {section.advanceable
                    ? t('Nenhuma corrida disponível para antecipação')
                    : t('Nenhuma corrida em processamento')}
                </Text>
              </PaddedView>
            )}
          </View>
        );
      }}
      renderItem={({ item, section }) => {
        const callback = () =>
          setSelected((values) =>
            values.includes(item.id) ? values.filter((id) => id !== item.id) : [...values, item.id]
          );
        return (
          <Pressable key={item.id} onPress={section.advanceable ? callback : null}>
            <View style={{ flex: 1, backgroundColor: colors.grey50 }}>
              <PaddedView style={{ flex: 1 }} half>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  {section.advanceable ? (
                    <CheckField checked={selected.includes(item.id)} onPress={callback} />
                  ) : null}
                  <View style={{ marginLeft: halfPadding }}>
                    <Text style={{ ...texts.sm }}>{item.client_share}</Text>
                    <Text style={{ ...texts.sm, color: colors.grey700, marginTop: halfPadding }}>
                      {`Feita em: ${formatDate(new Date(item.created_at))} ${formatTime(
                        new Date(item.created_at)
                      )}`}
                    </Text>
                    {!section.advanceable ? (
                      <Text style={{ ...texts.sm, color: colors.grey700, marginTop: halfPadding }}>
                        {`Disponível após: ${formatDate(
                          advanceableAt(item.created_at)
                        )} ${formatTime(new Date(item.created_at))}`}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </PaddedView>
            </View>
          </Pressable>
        );
      }}
      ListFooterComponent={
        <PaddedView>
          <DefaultButton
            title={canAdvanceReceivables ? t('Avançar') : t('Fora do horário')}
            onPress={advanceHandler}
            disabled={!canAdvanceReceivables || selected.length === 0}
          />
        </PaddedView>
      }
    />
  );
};
