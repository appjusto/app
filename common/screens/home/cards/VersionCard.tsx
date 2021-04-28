import React from 'react';
import { TouchableOpacity } from 'react-native';
import { t } from '../../../../strings';
import { IconVersion } from '../../../icons/icon-version';
import HomeCard from './HomeCard';

type Props = {
  title: string;
  subtitle: string;
};

export default function ({ title, subtitle }: Props) {
  return (
    <TouchableOpacity onPress={() => null}>
      <HomeCard icon={<IconVersion />} title={t(title)} subtitle={t(subtitle)} />
    </TouchableOpacity>
  );
}
