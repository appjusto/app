import { Feather } from '@expo/vector-icons';
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
  // handlers
  const advanceHandler = () => navigation.replace('AdvanceReceivables', { ids: selected });
  // UI
  return (
    <ScrollView style={{ ...screens.config }}>
      <View>
        <View style={{ backgroundColor: colors.white, padding }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: padding }}>
            <Feather name="info" size={14} />
            <Text style={{ ...texts.md, marginLeft: halfPadding }}>
              {t('Informações sobre a antecipação:')}
            </Text>
          </View>
          <Text style={{ ...texts.sm }}>
            {t('O AppJusto não fica com nada do valor do seu trabalho.')}
          </Text>
          <Text style={{ ...texts.sm, marginTop: padding }}>
            {t('Os pagamentos das suas corridas são processados com segurança pela iugu.')}
          </Text>
          <Text style={{ ...texts.sm, marginTop: padding }}>
            {t(
              'O prazo padrão para faturar os pagamentos é de 30 dias. Se quiser, você pode antecipar valores pagando uma taxa de até 2.5% por operação.'
            )}
          </Text>
          <Text style={{ ...texts.sm, marginTop: padding }}>
            {t(
              'Funciona assim: se quiser antecipar no primeiro dia útil após a corrida, você pagará o valor cheio de 2.5%. Mas a taxa diminui a cada dia.'
            )}
          </Text>
          <Text style={{ ...texts.sm, marginTop: padding }}>
            {t('Se você esperar 15 dias, por exemplo, ela fica em 1.25%.')}
          </Text>
        </View>

        <PaddedView>
          <PaddedView
            style={{
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
          <PaddedView style={{ backgroundColor: colors.grey500 }}>
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
              <View style={{ flex: 1, backgroundColor: colors.white }}>
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
