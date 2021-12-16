import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, SectionList, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as icons from '../../../../assets/icons';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import ConfigItem from '../../../../common/components/views/ConfigItem';
import FeedbackView from '../../../../common/components/views/FeedbackView';
import ShowIf from '../../../../common/components/views/ShowIf';
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
import { getMonthName } from '../../../../common/utils/formatters';
import { t } from '../../../../strings';
import { LoggedNavigatorParamList } from '../../types';
import { MainNavigatorParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainNavigatorParamList, 'OrderHistory'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<MainNavigatorParamList, 'OrderHistory'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

const Stack = createStackNavigator();
export default function ({ navigation, route }: Props) {
  // app state
  const user = useSelector(getUser);
  // screen state
  const options = React.useMemo(() => ({ consumerId: user?.uid }), [user?.uid]);
  const orders = useObserveOrders(options);
  const yearsWithOrders = getYearsWithOrders(orders);
  const monthsWithOrdersInYears = getMonthsWithOrdersInYear(orders);
  const months = React.useMemo(() => {
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
  }, [yearsWithOrders, monthsWithOrdersInYears, orders]);

  // tracking
  useSegmentScreen('OrderHistory');

  if (months.length === 0) {
    return (
      <FeedbackView
        header={t('Seu histórico está vazio')}
        description={t('Você ainda não fez nenhum pedido')}
        icon={<IconMotocycle />}
        background={colors.grey50}
      />
    );
  }

  // UI
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="OrderHistory"
        options={{ title: 'Seus pedidos' }}
        children={() => (
          <View style={[screens.config]}>
            <SectionList
              style={{ flex: 1 }}
              sections={months}
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
                const subtitle = (() => {
                  if (item.total === 1) return t('1 pedido');
                  else return `${item.total} ${t('pedidos')}`;
                })();
                return (
                  <ConfigItem
                    title={title}
                    subtitle={subtitle}
                    onPress={() => {
                      navigation.navigate('DeliveredOrderNavigator', {
                        screen: 'OrderHistoryByMonth',
                        params: {
                          year: item.year,
                          month: item.month,
                        },
                      });
                    }}
                  >
                    <ShowIf test={item.ongoing > 0}>
                      {() => (
                        <View style={{ marginTop: halfPadding }}>
                          <RoundedText backgroundColor={colors.yellow}>
                            {t('Pedido em andamento')}
                          </RoundedText>
                        </View>
                      )}
                    </ShowIf>
                  </ConfigItem>
                );
              }}
            />
          </View>
        )}
      />
    </Stack.Navigator>
  );
}
