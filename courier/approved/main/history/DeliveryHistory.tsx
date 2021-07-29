import { Feather } from '@expo/vector-icons';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React, { useMemo } from 'react';
import { Image, Linking, SectionList, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../../../assets/icons';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import ConfigItem from '../../../../common/components/views/ConfigItem';
import FeedbackView from '../../../../common/components/views/FeedbackView';
import ShowIf from '../../../../common/components/views/ShowIf';
import { IconIuguLogo } from '../../../../common/icons/icon-iugu-logo';
import { IconMotocycle } from '../../../../common/icons/icon-motocycle';
import { defaultScreenOptions } from '../../../../common/screens/options';
import { useObserveOrders } from '../../../../common/store/api/order/hooks/useObserveOrders';
import { useSegmentScreen } from '../../../../common/store/api/track';
import {
  getMonthsWithOrdersInYear,
  getOrdersWithFilter,
  getYearsWithOrders,
  summarizeOrders,
} from '../../../../common/store/order/selectors';
import { getUser } from '../../../../common/store/user/selectors';
import { colors, halfPadding, padding, screens, texts } from '../../../../common/styles';
import { formatCurrency, getMonthName } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import { ApprovedParamList } from '../../types';
import { MainParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainParamList, 'DeliveryHistory'>,
  StackNavigationProp<ApprovedParamList>
>;
type ScreenRoute = RouteProp<MainParamList, 'DeliveryHistory'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRoute;
};

const Stack = createStackNavigator();
export default function ({ navigation, route }: Props) {
  // app state
  const user = useSelector(getUser);
  // screen state
  const options = React.useMemo(() => ({ courierId: user?.uid }), [user?.uid]);
  const orders = useObserveOrders(options);
  const yearsWithOrders = getYearsWithOrders(orders);
  const monthsWithOrdersInYears = getMonthsWithOrdersInYear(orders);

  // screen state
  // data structure
  // [ { title: '2020', data: [ { monthName: 'Agosto', deliveries: 3, courierFee: 100 }] }]
  const sections = useMemo(() => {
    return yearsWithOrders.map((year) => {
      const monthsInYear = monthsWithOrdersInYears(year);

      return {
        title: String(year),
        data: monthsInYear.map((month) => ({
          key: `${year}-${month}`,
          year,
          month,
          ...summarizeOrders(getOrdersWithFilter(orders, year, month)),
        })),
      };
    });
  }, [yearsWithOrders]);
  // side effects
  // tracking
  useSegmentScreen('Delivery History');
  // handlers
  const firstAccessHandler = () => {
    Linking.openURL('https://appjusto.freshdesk.com/support/solutions/articles/67000666391');
  };
  const withdrawHandler = () => {
    Linking.openURL('https://appjusto.freshdesk.com/support/solutions/articles/67000665752');
  };
  // UI
  if (sections.length === 0) {
    return (
      <FeedbackView
        header={t('Seu histórico está vazio')}
        description={t('Você ainda não fez nenhuma corrida')}
        icon={<IconMotocycle />}
        background={colors.grey50}
      />
    );
  }

  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="DeliveryHistory"
        options={{ title: 'Suas corridas' }}
        children={() => (
          <View style={{ ...screens.config }}>
            <SectionList
              style={{ flex: 1 }}
              sections={sections}
              keyExtractor={(item) => item.key}
              renderSectionHeader={({ section }) => (
                <PaddedView
                  style={{
                    flexDirection: 'row',
                    borderBottomColor: colors.grey500,
                    borderBottomWidth: 1,
                  }}
                >
                  <Image source={icons.calendar} />
                  <Text style={{ ...texts.md, marginLeft: padding }}>{section.title}</Text>
                </PaddedView>
              )}
              renderItem={({ item }) => {
                const title = getMonthName(item.month);
                const subtitle =
                  item.delivered +
                  t(' corridas finalizadas') +
                  '\n' +
                  t('Total recebido: ') +
                  formatCurrency(item.courierFee);
                return (
                  <ConfigItem
                    title={title}
                    subtitle={subtitle}
                    onPress={() =>
                      navigation.navigate('DeliveriesNavigator', {
                        screen: 'DeliveryHistoryByMonth',
                        params: {
                          year: item.year,
                          month: item.month,
                        },
                      })
                    }
                  >
                    <ShowIf test={item.ongoing > 0}>
                      {() => (
                        <View style={{ marginTop: halfPadding }}>
                          <RoundedText backgroundColor={colors.yellow}>
                            {t('Corrida em andamento')}
                          </RoundedText>
                        </View>
                      )}
                    </ShowIf>
                  </ConfigItem>
                );
              }}
              ListHeaderComponent={
                sections.length > 0 ? (
                  <View style={{ ...screens.default }}>
                    <PaddedView>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <View style={{ width: '70%' }}>
                          <Text style={{ ...texts.sm, color: colors.grey700 }}>
                            {t('Para transferir ou adiantar seus ganhos, acesse sua conta na IUGU')}
                          </Text>
                        </View>
                        <View>
                          <IconIuguLogo />
                        </View>
                      </View>
                      <View
                        style={{
                          paddingVertical: padding,
                        }}
                      >
                        <DefaultButton
                          title={t('Acessar IUGU para fazer transferências')}
                          onPress={() => Linking.openURL('https://alia.iugu.com/')}
                          style={{ width: '100%' }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <TouchableOpacity onPress={firstAccessHandler}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Feather name="info" size={14} />
                            <Text
                              style={{
                                ...texts.xs,
                                textDecorationLine: 'underline',
                                marginLeft: 4,
                                paddingBottom: 2,
                              }}
                            >
                              {t('Primeiro acesso')}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={withdrawHandler}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Feather name="info" size={14} />
                            <Text
                              style={{
                                ...texts.xs,
                                textDecorationLine: 'underline',
                                marginLeft: 4,
                                paddingBottom: 2,
                              }}
                            >
                              {t('Como sacar meus ganhos')}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </PaddedView>
                  </View>
                ) : null
              }
            />
          </View>
        )}
      />
    </Stack.Navigator>
  );
}
