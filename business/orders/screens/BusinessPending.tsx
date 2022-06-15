import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSelector } from 'react-redux';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../common/icons/icon-cone-yellow';
import { useSegmentScreen } from '../../../common/store/api/track';
import { getManager } from '../../../common/store/business/selectors';
import { colors, screens } from '../../../common/styles';
import { t } from '../../../strings';
import { BusinessAppContext } from '../../BusinessAppContext';

export const BusinessPending = () => {
  // context
  const { business } = React.useContext(BusinessAppContext);
  const manager = useSelector(getManager);
  //helpers
  const header = (() => {
    if (business?.situation !== 'approved') {
      return t('O cadastro do seu restaurante ainda não foi aprovado');
    }
    if (manager?.situation !== 'approved') {
      return t('O cadastro do seu colaborador ainda não foi aprovado');
    } else
      return t('Os cadastros do seu restaurante e do seu colaborador ainda não foram aprovados');
  })();
  const description = t(
    'Por favor, acesse o Portal do restaurante através do seu computador ou tablet para finalizar o cadastro, ou aguarde até o restaurante ser aprovado na plataforma'
  );
  // tracking
  useSegmentScreen('Business Pending screen');
  // UI
  if (!business || !manager) {
    return (
      <View style={screens.centered}>
        <ActivityIndicator size="large" color={colors.green500} />
      </View>
    );
  }
  return (
    <FeedbackView
      header={header}
      description={description}
      icon={<IconConeYellow />}
      background={colors.white}
    />
  );
};
