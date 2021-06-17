import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView } from 'react-native';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../common/icons/icon-cone-yellow';
import { colors, padding, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { OngoingOrderNavigatorParamList } from '../ongoing/types';
import { LoggedNavigatorParamList } from '../types';

type ScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<OngoingOrderNavigatorParamList, 'OngoingOrderDeclined'>,
  StackNavigationProp<LoggedNavigatorParamList>
>;
type ScreenRouteProp = RouteProp<OngoingOrderNavigatorParamList, 'OngoingOrderDeclined'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const OngoingOrderDeclined = ({ navigation, route }: Props) => {
  return (
    <ScrollView style={{ ...screens.default }} contentContainerStyle={{ flexGrow: 1 }}>
      <FeedbackView
        header={t('Problemas no pagamento')}
        description={t(
          'Não conseguimos efetuar a cobrança na forma de pagamento escolhida. Por favor, altere a forma de pagamento e tente novamente.'
        )}
        icon={<IconConeYellow />}
        background={colors.white}
      >
        <DefaultButton title={t('Alterar forma de pagamento')} />
        <DefaultButton title={t('Revisar pedido')} secondary style={{ marginVertical: padding }} />
      </FeedbackView>
    </ScrollView>
  );
};
