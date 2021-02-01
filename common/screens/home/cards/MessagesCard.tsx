import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { t } from '../../../../strings';
import PaddedView from '../../../components/containers/PaddedView';
import { colors, halfPadding, texts } from '../../../styles';

interface Props {
  unreadCount: number;
  onPress: () => void;
}

export const MessagesCard = ({ unreadCount, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderBottomWidth: 1,
          borderBottomColor: colors.darkGrey,
          backgroundColor: colors.white,
        }}
      >
        <PaddedView style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="message-circle" size={18} />
          <Text style={{ ...texts.small, marginLeft: halfPadding }}>
            {t('Você tem')} {unreadCount} {t('novas mensagens.')}
          </Text>
          <View style={{ flex: 1 }} />
          <Text style={{ ...texts.small, ...texts.bold, color: colors.darkGreen }}>
            {t('Abrir chat')}
          </Text>
        </PaddedView>
      </View>
    </TouchableOpacity>
  );
};
