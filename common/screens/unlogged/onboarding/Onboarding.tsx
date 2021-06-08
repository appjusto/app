import ViewPager, { ViewPagerOnPageScrollEventData } from '@react-native-community/viewpager';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import {
  Dimensions,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import * as Sentry from 'sentry-expo';
import { LoggedNavigatorParamList } from '../../../../consumer/v2/types';
import { UnapprovedParamList } from '../../../../courier/unapproved/types';
import { t } from '../../../../strings';
import { ApiContext } from '../../../app/context';
import DefaultButton from '../../../components/buttons/DefaultButton';
import DefaultInput from '../../../components/inputs/DefaultInput';
import { getFlavor } from '../../../store/config/selectors';
import { getConsumer } from '../../../store/consumer/selectors';
import { getCourier } from '../../../store/courier/selectors';
import { getUser, hasPendingWrites } from '../../../store/user/selectors';
import {
  borders,
  colors,
  doublePadding,
  halfPadding,
  padding,
  screens,
  texts,
} from '../../../styles';
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
  const pendingWrite = useSelector(hasPendingWrites);
  const courier = useSelector(getCourier);
  const consumer = useSelector(getConsumer);
  // state
  const steps = flavor === 'courier' ? config.courier : config.consumer;
  const [step, setStep] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  const [city, setCity] = React.useState('');
  // effects
  React.useEffect(() => {
    setLoading(pendingWrite);
  }, [user, pendingWrite]);
  // refs
  const viewPager = React.useRef<ViewPager>(null);
  const { height } = Dimensions.get('window');
  const tallerDevice = height > 640;
  // handlers
  const advanceHandler = async () => {
    if (step + 1 < steps.length) {
      viewPager?.current?.setPage(step + 1);
    } else {
      setLoading(true);
      try {
        // consumer: we need to send the city in this updateProfile call
        await api.profile().updateProfile(user.uid, { onboarded: true });
        if (flavor === 'courier') {
          navigation.replace('ProfilePending');
        } else {
          // consumer: navigate to the new Screen 'ConsumerRegistration'
          navigation.navigate('MainNavigator', { screen: 'Home' });
        }
      } catch (error) {
        console.log(flavor === 'courier' ? courier : consumer);
        Sentry.Native.captureException(error);
      }
      setLoading(false);
    }
  };
  const onPageScroll = (ev: NativeSyntheticEvent<ViewPagerOnPageScrollEventData>) => {
    const { nativeEvent } = ev;
    const { position } = nativeEvent;
    if (position !== step) {
      setStep(position);
    }
  };
  const styles = StyleSheet.create({
    bigScreen: {
      justifyContent: tallerDevice ? 'center' : undefined,
    },
  });
  // UI
  return (
    <View style={{ ...screens.default }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ViewPager ref={viewPager} style={{ flex: 1 }} onPageScroll={onPageScroll}>
          {steps.map(({ icon, header, body, input }, index) => (
            <View key={index} style={[{ paddingHorizontal: padding, flex: 1 }, styles.bigScreen]}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {tallerDevice ? <View>{icon}</View> : null}
                <Text style={{ ...texts.x2l, marginTop: 32, textAlign: 'center' }}>{header}</Text>
                {input && (
                  <DefaultInput
                    title={t('Cidade')}
                    placeholder={t('Digite sua cidade')}
                    value={city}
                    onChangeText={setCity}
                    textAlignVertical="top"
                    style={{ marginTop: doublePadding }}
                  />
                )}
                {body.map((value) => (
                  <Text key={value} style={{ ...texts.md, marginTop: 32, textAlign: 'center' }}>
                    {value}
                  </Text>
                ))}
                <Pressable onPress={() => navigation.navigate('RegistrationSubmitted')}>
                  <Text>IR PARA REGISTRATION SUBMITTED</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ViewPager>
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
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
      <SafeAreaView>
        <DefaultButton
          title={step === steps.length - 1 ? t('Começar') : t('Avançar')}
          style={{ marginTop: 32, marginBottom: padding, marginHorizontal: padding }}
          onPress={advanceHandler}
          disabled={isLoading}
          activityIndicator={isLoading}
        />
      </SafeAreaView>
    </View>
  );
};
