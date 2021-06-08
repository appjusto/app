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
