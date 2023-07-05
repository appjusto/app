import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNotificationToken } from '../../../common/hooks/useNotificationToken';
import { useSegmentScreen } from '../../../common/store/api/track';
import { colors, doublePadding, padding, screens, texts } from '../../../common/styles';
import { HowAppJustoWorksContent } from '../../approved/main/howitworks/HowAppJustoWorksContent';
import { UnapprovedParamList } from '../types';
import { ProfileSubmittedIcon } from './icon';

type ScreenNavigationProp = StackNavigationProp<UnapprovedParamList, 'ProfileSubmitted'>;
type ScreenRouteProp = RouteProp<UnapprovedParamList, 'ProfileSubmitted'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export const ProfileSubmitted = ({ navigation }: Props) => {
  // side effects
  useNotificationToken();
  useSegmentScreen('Profile Submitted');
  // UI
  return (
    <ScrollView style={{ ...screens.config }} scrollIndicatorInsets={{ right: 1 }}>
      <View>
        <View
          style={{
            paddingHorizontal: padding,
            paddingVertical: 80,
            alignItems: 'center',
            backgroundColor: colors.primary,
          }}
        >
          <ProfileSubmittedIcon />
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
              Cadastro enviado com sucesso!
            </Text>
            <Text
              style={{
                ...texts.sm,
                color: colors.grey800,
                textAlign: 'center',
              }}
            >
              Enquanto seu cadastro não é aprovado, conheça mais sobre o AppJusto
            </Text>
          </View>
        </View>
        <HowAppJustoWorksContent navigation={navigation} />
      </View>
    </ScrollView>
  );
};
