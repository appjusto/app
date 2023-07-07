import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { IconProblemCancel } from '../../../../common/icons/icon-problem-cancel';
import { IconProblemChat } from '../../../../common/icons/icon-problem-chat';
import { IconProblemComplaint } from '../../../../common/icons/icon-problem-complaint';
import { IconProblemPack } from '../../../../common/icons/icon-problem-pack';
import { IconProblemSupport } from '../../../../common/icons/icon-problem-support';
import { IconProblemUrgent } from '../../../../common/icons/icon-problem-urgent';
import HomeCard from '../../../../common/screens/home/cards/HomeCard';
import { padding } from '../../../../common/styles';

type Props = {
  title: string;
  subtitle: string;
  onPress: () => void;
  situation:
    | 'drop'
    | 'courier-problem'
    | 'consumer-problem'
    | 'chat'
    | 'urgent'
    | 'complaint'
    | 'support';
};

export const DeliveryProblemCard = ({ title, subtitle, onPress, situation }: Props) => {
  const icon = (() => {
    if (situation === 'drop') return <IconProblemCancel />;
    else if (situation === 'chat') return <IconProblemChat />;
    else if (situation === 'urgent') return <IconProblemUrgent />;
    else if (situation === 'complaint') return <IconProblemComplaint />;
    else if (situation === 'support') return <IconProblemSupport />;
    else return <IconProblemPack />;
  })();
  return (
    <View>
      <TouchableOpacity style={{ marginBottom: padding }} onPress={onPress}>
        <HomeCard icon={icon} title={title} subtitle={subtitle} />
      </TouchableOpacity>
    </View>
  );
};
