import React from 'react';
import { t } from '../../../../strings';
import { IconBeta } from '../../../icons/icon-beta';
import { IconHangLoose } from '../../../icons/icon-hang-loose';
import { IconSetLocation } from '../../../icons/icon-set-location';

export interface ScreenConfig {
  icon: React.ReactNode;
  header: string;
  body: string[];
  input?: boolean;
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
        'Estamos em fase de testes para construir o melhor serviço para você. Logo, logo liberaremos o app e você poderá participar de uma economia mais justa.'
      ),
    ],
    icon: <IconBeta />,
  },
  {
    header: t('Em qual cidade você mora?'),
    body: [t('Informaremos assim que o app estiver disponível perto de você!')],
    icon: <IconSetLocation />,
    input: true,
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
      'Se pedir comida, o entregador recebe o valor integral da corrida! Nas encomendas, os entregadores recebem o valor da frota que você escolher.'
    ),
  },
  {
    header: t('Escolha a frota que quiser'),
    body: t(
      'No AppJusto, os entregadores podem criar frotas com condições próprias e definir o valor de seu trabalho. Escolha a frota que quiser para o seu pedido!'
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
    header: t('Com paciência vai dar certo'),
    body: t(
      'Ainda não temos previsão para o início das operações. Isso ocorrerá quando iniciarem os pedidos na plataforma. Fique tranquilo que vamos te avisar!'
    ),
  },
  {
    header: t('Aprovações durante o beta'),
    body: t(
      'Aprovações ocorrerão de acordo com o aumento de pedidos. Entraremos em contato para verificar seu interesse em começar com a gente.'
    ),
  },
  {
    header: t('Acompanhe as novidades'),
    body: t('Adicione o nosso número no WhatsApp para atualizações:'),
    button: true,
  },
];
