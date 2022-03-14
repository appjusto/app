import React from 'react';
import FeedbackView from '../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../common/icons/icon-cone-yellow';
import { useSegmentScreen } from '../../../common/store/api/track';
import { colors } from '../../../common/styles';
import { t } from '../../../strings';

export const BusinessPending = () => {
  //helpers
  const header = t('O cadastro do seu restaurante ainda não foi aprovado');
  const description = t(
    'Por favor, acesse o Portal do restaurante através do seu computador ou tablet para finalizar o cadastro, ou aguarde até o restaurante ser aprovado na plataforma'
  );
  // tracking
  useSegmentScreen('Business Pending screen');
  // UI
  return (
    <FeedbackView
      header={header}
      description={description}
      icon={<IconConeYellow />}
      background={colors.white}
    />
  );
};
