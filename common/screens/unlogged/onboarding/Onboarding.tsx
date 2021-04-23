import ViewPager from '@react-native-community/viewpager';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { UnapprovedParamList } from '../../../../courier/unapproved/types';
import { ApiContext } from '../../../app/context';
import DefaultButton from '../../../components/buttons/DefaultButton';
import { getFlavor } from '../../../store/config/selectors';
import { getUser } from '../../../store/user/selectors';
import { borders, colors, halfPadding, padding, texts } from '../../../styles';
import * as config from './config';

type ScreenNavigationProp = StackNavigationProp<UnapprovedParamList, 'CourierOnboarding'>;

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
  // refs
  const viewPager = React.useRef<ViewPager>(null);
  // handlers
  const advanceHandler = () => {
    if (step + 1 < steps.length) {
      setStep(step + 1);
    } else {
      api.profile().updateProfile(user.uid, { onboarded: true });
      if (flavor === 'courier') {
        navigation.navigate('ProfilePending');
      } else {
        // TODO: for consumer
      }
    }
  };
  // UI
  return (
    <ViewPager ref={viewPager}>
      {steps.map(({ icon, header, body, buttonTitle }) => (
        <View>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 48 }}>
            {icon}
            <Text style={{ ...texts.x2l, marginTop: 32, textAlign: 'center' }}>{header}</Text>
            {body.map((value) => (
              <Text style={{ ...texts.md, marginTop: 32, textAlign: 'center' }}>{value}</Text>
            ))}
          </View>
          <View>
            {new Array(steps.length).fill('').map((_, i) => (
              <View
                style={{
                  height: halfPadding,
                  width: halfPadding,
                  ...borders.default,
                  borderRadius: 4,
                  backgroundColor: step === i ? colors.black : colors.grey50,
                  marginRight: halfPadding,
                }}
                key={i}
              />
            ))}
          </View>
          <DefaultButton
            title={buttonTitle}
            style={{ marginTop: 32, marginBottom: padding }}
            onPress={advanceHandler}
          />
        </View>
      ))}
    </ViewPager>
  );
};
