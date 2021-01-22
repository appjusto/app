import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import PaddedView from '../../../../common/components/containers/PaddedView';
import GrayLine from '../../../../common/components/views/GrayLine';
import HR from '../../../../common/components/views/HR';
import { colors, padding, screens, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import PlaceSummary from '../../orders/p2p-order/PlaceSummary';
import AddInfo from '../components/AddInfo';
import SingleHeader from '../SingleHeader';
import { RestaurantsNavigatorParamList } from '../types';

type ScreenNavigationProp = StackNavigationProp<RestaurantsNavigatorParamList, 'CartSummary'>;

export default function () {
  //state
  const [info, setInfo] = React.useState<string>('');
  return (
    <ScrollView style={{ ...screens.default }}>
      {/* destination */}
      <PaddedView>
        <PlaceSummary
          title={t('Entregar em')}
          place={t('Rua Teodoro Sampaio, 198')}
          editStepHandler={() => null}
        />
      </PaddedView>
      <HR height={padding} />
      {/* restaurant and items ordered */}
      <SingleHeader title="Nome do restaurante" />
      <TouchableOpacity onPress={() => null} style={{ marginBottom: padding }}>
        <Text style={{ ...texts.default, color: colors.darkGreen, padding }}>
          {t('Adicionar mais itens')}
        </Text>
        <GrayLine />
      </TouchableOpacity>
      <AddInfo value={info} onAddInfo={setInfo} />
      <HR height={padding} />
      {/* details */}
      {/* <ChargesBox
          selectedFare={selectedFare!}
          platformFee={platformFee}
          platformFeeOptions={platformFeeOptions}
          onContribution={setPlatformFee}
        /> */}
    </ScrollView>
  );
}
