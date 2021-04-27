import ViewPager, { ViewPagerOnPageScrollEventData } from '@react-native-community/viewpager';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { NativeSyntheticEvent, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { LoggedNavigatorParamList } from '../../../../consumer/v2/types';
import { UnapprovedParamList } from '../../../../courier/unapproved/types';
import { t } from '../../../../strings';
import { ApiContext } from '../../../app/context';
import DefaultButton from '../../../components/buttons/DefaultButton';
import { getFlavor } from '../../../store/config/selectors';
import { getUser } from '../../../store/user/selectors';
import { borders, colors, halfPadding, padding, screens, texts } from '../../../styles';
import * as config from './config';

type ScreenNavigationProp = StackNavigationProp<
  UnapprovedParamList & LoggedNavigatorParamList,
  'CourierOnboarding'
>;

type Props = {
  navigation: ScreenNavigationProp;
};

export const Onboarding = ({ navigation }: Props) => {
  // context
  const api = useContext(ApiContext);
  // redux store
  const flavor = useSelector(getFlavor);
  const user = useSelector(getUser)!;
  // state
  const steps = flavor === 'courier' ? config.courier : config.consumer;
  const [step, setStep] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  // refs
  const viewPager = React.useRef<ViewPager>(null);
  // handlers
  const advanceHandler = async () => {
    if (step + 1 < steps.length) {
      viewPager?.current?.setPage(step + 1);
    } else {
      setLoading(true);
      await api.profile().updateProfile(user.uid, { onboarded: true });
      setLoading(false);
      if (flavor === 'courier') {
        navigation.navigate('ProfilePending');
      } else {
        navigation.navigate('MainNavigator', { screen: 'Home' });
      }
    }
  };
  const onPageScroll = (ev: NativeSyntheticEvent<ViewPagerOnPageScrollEventData>) => {
    const { nativeEvent } = ev;
    const { position } = nativeEvent;
    if (position !== step) {
      setStep(position);
    }
  };
  // UI
  return (
    <View style={{ ...screens.default }}>
      <ScrollView>
        <ViewPager ref={viewPager} style={{ flex: 1, height: 500 }} onPageScroll={onPageScroll}>
          {steps.map(({ icon, header, body }, index) => (
            <View key={index} style={{ paddingHorizontal: padding }}>
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 48 }}>
                {icon}
                <Text style={{ ...texts.x2l, marginTop: 32, textAlign: 'center' }}>{header}</Text>
                {body.map((value) => (
                  <Text key={value} style={{ ...texts.md, marginTop: 32, textAlign: 'center' }}>
                    {value}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </ViewPager>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 32,
          }}
        >
          {new Array(steps.length).fill('').map((_, i) => (
            <View
              style={{
                height: halfPadding,
                width: halfPadding,
                ...borders.default,
                borderColor: step === i ? colors.black : colors.grey500,
                borderRadius: 4,
                backgroundColor: step === i ? colors.black : colors.grey500,
                marginRight: halfPadding,
              }}
              key={i}
            />
          ))}
        </View>
        <DefaultButton
          title={step === steps.length - 1 ? t('Começar') : t('Avançar')}
          style={{ marginTop: 32, marginBottom: padding, marginHorizontal: padding }}
          onPress={advanceHandler}
          disabled={isLoading}
        />
      </ScrollView>
    </View>
  );
};
