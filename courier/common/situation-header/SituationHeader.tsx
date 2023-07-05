import React from 'react';
import { ColorValue, Text, View } from 'react-native';
import { colors, doublePadding, padding, texts } from '../../../common/styles';
import { ProfileBlockedIcon } from './blocked';
import { ProfileInactiveIcon } from './inactive';
import { ProfileSubmittedIcon } from './submitted';

interface Props {
  variant: 'approved' | 'blocked' | 'inactive';
}

export const SituationHeader = ({ variant }: Props) => {
  // color
  let backgroundColor: ColorValue = colors.primary;
  if (variant === 'blocked') backgroundColor = colors.yellow;
  else if (variant === 'inactive') backgroundColor = colors.grey500;
  // title
  let title = 'Cadastro enviado com sucesso!';
  if (variant === 'blocked') {
    title = 'O seu cadastro está bloqueado';
  } else if (variant === 'inactive') {
    title = 'O seu cadastro está sob análise';
  }
  // subtitle
  let subtitle = 'Enquanto seu cadastro não é aprovado, conheça mais sobre o AppJusto';
  if (variant === 'blocked') {
    subtitle = 'Caso precise, entre em contato com nosso time de atendimento';
  } else if (variant === 'inactive') {
    subtitle =
      'Estamos analisando possível falha operacional. Por favor, entre em contato com nosso time de atendimento';
  }
  return (
    <View
      style={{
        paddingHorizontal: padding,
        paddingVertical: 80,
        alignItems: 'center',
        backgroundColor,
      }}
    >
      {variant === 'approved' ? <ProfileSubmittedIcon /> : null}
      {variant === 'blocked' ? <ProfileBlockedIcon /> : null}
      {variant === 'inactive' ? <ProfileInactiveIcon /> : null}
      <View
        style={{
          paddingHorizontal: doublePadding,
          marginTop: doublePadding,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            ...texts.xl,
            marginBottom: 4,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            ...texts.sm,
            color: colors.grey800,
            textAlign: 'center',
          }}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
};
