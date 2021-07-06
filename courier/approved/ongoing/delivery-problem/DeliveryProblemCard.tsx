import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { IconProblemCancel } from '../../../../common/icons/icon-problem-cancel';
import { IconProblemPack } from '../../../../common/icons/icon-problem-pack';
import HomeCard from '../../../../common/screens/home/cards/HomeCard';
import { padding } from '../../../../common/styles';

type Props = {
  title: string;
  subtitle: string;
  onPress: () => void;
  situation: 'drop' | 'problem';
};

export const DeliveryProblemCard = ({ title, subtitle, onPress, situation }: Props) => {
  return (
    <View>
      <TouchableOpacity style={{ marginBottom: padding }} onPress={onPress}>
        <HomeCard
          icon={situation === 'drop' ? <IconProblemCancel /> : <IconProblemPack />}
          title={title}
          subtitle={subtitle}
        />
      </TouchableOpacity>
    </View>
  );
};
