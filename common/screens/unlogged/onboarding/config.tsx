import React from 'react';
import { t } from '../../../../strings';
import { IconBeta } from '../../../icons/icon-beta';
import { IconHangLoose } from '../../../icons/icon-hang-loose';
import { IconHeartBox } from '../../../icons/icon-heart-box';
import { IconOnboardingDelivery } from '../../../icons/icon-onboarding-delivery';
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
    header: t('Use para pedir comida e enviar encomendas'),
    body: [
      t(
        'No Delivery de comida, o entregador recebe o valor integral da corrida e cobramos a menor taxa dos restaurantes. Na entrega de encomendas, os entregadores recebem o valor da frota que você escolher.'
      ),
    ],
    icon: <IconOnboardingDelivery />,
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
    header: t('Use o AppJusto e indique para os seus amigos'),
    body: [
      t(
        'Quanto mais usar e indicar, mais você ajuda nosso movimento a crescer. Contribua para um delivery mais justo na sua região! Vamos começar?'
      ),
    ],
    icon: <IconShareBig />,
  },
];

export interface RegistrationSubmittedConfig {
  header: string;
  body: string;
  button?: boolean;
}

export const registrationSubmitted: RegistrationSubmittedConfig[] = [
  {
    header: t('Use o AppJusto para pedir comida e enviar encomendas'),
    body: t(
      'Se pedir comida, o/a entregador/a recebe o valor integral da corrida! Nas encomendas, os/as entregadores/as recebem o valor da frota que você escolher.'
    ),
  },
  {
    header: t('Escolha a frota que quiser'),
    body: t(
      'No AppJusto, os/as entregadores/as podem criar frotas com condições próprias e definir o valor de seu trabalho. Escolha a frota que quiser para o seu pedido!'
    ),
  },
  {
    header: t('Restaurantes pagam menos para você pagar menos!'),
    body: t(
      'Cobramos a menor taxa dos restaurantes para que eles possam oferecer preços menores. Nos outros apps, o custo é alto e acaba sendo repassado aos clientes.'
    ),
  },
];
export const profileSubmitted: RegistrationSubmittedConfig[] = [
  {
    header: t('Aprovações durante o beta'),
    body: t(
      'Aprovações ocorrerão de acordo com o aumento de pedidos. Entraremos em contato para verificar seu interesse em começar com a gente.'
    ),
  },
  {
    header: t('Acompanhe as novidades'),
    body: t('Adicione o nosso número no\n WhatsApp para atualizações:'),
    button: true,
  },
];
