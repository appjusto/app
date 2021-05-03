import React from 'react';
import { t } from '../../../../strings';
import { IconAppDelivery } from '../../../icons/icon-app-delivery';
import { IconBeta } from '../../../icons/icon-beta';
import { IconHangLoose } from '../../../icons/icon-hang-loose';
import { IconHeartBox } from '../../../icons/icon-heart-box';
import { IconShareBig } from '../../../icons/icon-share-big';

export interface ScreenConfig {
  icon: React.ReactNode;
  header: string;
  body: string[];
}
export const courier: ScreenConfig[] = [
  {
    header: t('Boas vindas,\n que legal ver você aqui!'),
    body: [
      t(
        'No AppJusto, você participa de um movimento por relações mais justas e pelo fim da precarização do trabalho. Ajude divulgando essa ideia!'
      ),
    ],
    icon: <IconHangLoose />,
  },
  {
    header: t('O AppJusto ainda está\n em fase de testes'),
    body: [
      t(
        'Estamos em fase de testes na plataforma para construir o melhor serviço para você. Fique à vontade para contribuir com sugestões sobre melhorias e problemas.'
      ),
    ],
    icon: <IconBeta />,
  },
];

export const consumer: ScreenConfig[] = [
  {
    header: t('Boas vindas,\n que legal ver você aqui!'),
    body: [
      t(
        'O AppJusto nasceu para combater a precarização do trabalho. Somos um movimento por relações mais justas entre consumidores, restaurantes e entregadores.'
      ),
    ],
    icon: <IconHangLoose />,
  },
  {
    header: t('O AppJusto ainda está\n em fase de testes'),
    body: [
      t(
        'Estamos em fase de testes na plataforma para construir o melhor serviço para você. Fique à vontade para contribuir com sugestões sobre melhorias e problemas.'
      ),
    ],
    icon: <IconBeta />,
  },
  {
    header: t('Use para pedir comida e enviar\n encomendas'),
    body: [
      t(
        'No Delivery de comida, o entregador recebe o valor integral da corrida e cobramos a menor taxa dos restaurantes. Na entrega de encomendas, os entregadores recebem o valor da frota que você escolher.'
      ),
    ],
    icon: <IconAppDelivery />,
  },
  {
    header: t('Escolha a frota que quiser!'),
    body: [
      t(
        'No AppJusto, os entregadores podem criar frotas com as suas próprias condições. Você escolhe a que mais se identificar! Elas são ordenadas pela quantidade de entregadores perto de você.'
      ),
    ],
    icon: <IconHeartBox />,
  },
  {
    header: t('Use o AppJusto e indique para\n os seus amigos'),
    body: [
      t(
        'Quanto mais usar e indicar, mais você ajuda esse movimento a crescer. Contribua para um delivery mais justo na sua região! Vamos começar?'
      ),
    ],
    icon: <IconShareBig />,
  },
];
