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
    // body: [
    //   t(
    //     'No AppJusto, além de fazer parte de um app de entregas, agora você participa de um movimento por relações mais justas e pelo fim da precarização do trabalho.'
    //   ),
    //   t(
    //     'Estamos apenas começando. Com o comprometimento de todos, vamos dar certo. Ajude divulgando esse movimento!'
    //   ),
    // ],
    icon: <IconHangLoose />,
  },
  {
    header: t('O AppJusto ainda está\n em fase de testes'),
    body: [
      t(
        'Estamos em fase de testes na plataforma para construir o melhor serviço para você. Fique à vontade para contribuir com sugestões sobre melhorias e problemas.'
      ),
    ],
    // body: [
    //   t(
    //     'Por enquanto, estamos em fase de validação e testes da plataforma. Queremos construir o melhor serviço para você.'
    //   ),
    //   t(
    //     'Você nos ajuda ao avisar pelo chat se perceber qualquer problema. Fique à vontade para contribuir com sugestões. Vamos juntos!'
    //   ),
    // ],
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
    // body: [
    //   t(
    //     'No AppJusto, além de um app de entregas, somos um movimento por relações mais justas para consumidores, restaurantes e entregadores.'
    //   ),
    //   t(
    //     'O AppJusto veio para combater a precarização do trabalho e, com a participação de todos, podemos fazer a diferença!'
    //   ),
    // ],
    icon: <IconHangLoose />,
  },
  {
    header: t('O AppJusto ainda está\n em fase de testes'),
    body: [
      t(
        'Estamos em fase de testes na plataforma para construir o melhor serviço para você. Fique à vontade para contribuir com sugestões sobre melhorias e problemas.'
      ),
    ],
    // body: [
    //   t(
    //     'Por enquanto, estamos em fase de validação e testes da plataforma. Queremos construir o melhor serviço para você.'
    //   ),
    //   t(
    //     'Você nos ajuda ao avisar pelo chat se perceber qualquer problema, e fique à vontade para contribuir com sugestões. Vamos juntos!'
    //   ),
    // ],
    icon: <IconBeta />,
  },
  {
    header: t('Use para pedir comida e enviar\n encomendas'),
    body: [
      t(
        'No Delivery de comida, o entregador recebe o valor integral da corrida e cobramos a menor taxa dos restaurantes. Na entrega de encomendas, os entregadores recebem o valor da frota que você escolher.'
      ),
    ],
    // body: [
    //   t(
    //     'No Delivery de comida, transferimos o valor integral das entregas para o entregador e cobramos a menor comissão dos restaurantes. Tudo para você ter o melhor serviço e menos pelos produtos.'
    //   ),
    //   t('Na entrega de encomendas, os entregadores recebem o valor da frota que você escolher.'),
    // ],
    icon: <IconAppDelivery />,
  },
  {
    header: t('Escolha a frota que quiser!'),
    body: [
      t(
        'No AppJusto, os entregadores podem criar frotas com as suas próprias condições. Você escolhe a que mais se identificar! Elas são ordenadas pela quantidade de entregadores perto de você.'
      ),
    ],
    // body: [
    //   t(
    //     'O AppJusto possibilita que os próprios entregadores criem frotas com as suas preferências. Ao fazer o pedido, você escolhe a frota que mais se identificar!'
    //   ),
    //   t(
    //     'As frotas podem variar por remuneração, causa social, emissão de CO2, entre outras. Elas são ordenadas por quantidade de entregadores próximos a você.'
    //   ),
    // ],
    icon: <IconHeartBox />,
  },
  {
    header: t('Use o AppJusto e indique para\n os seus amigos'),
    body: [
      t(
        'Quanto mais usar e indicar, mais você ajuda esse movimento a crescer. Contribua para um delivery mais justo na sua região! Vamos começar?'
      ),
    ],
    // body: [
    //   t('Quanto mais você usar e indicar, mais você ajuda esse movimento a crescer!'),
    //   t(
    //     'Usando o AppJusto, você contribui para um delivery mais justo na sua região, favorecendo entregadores e restaurantes locais.\n Vamos começar?'
    //   ),
    // ],
    icon: <IconShareBig />,
  },
];
