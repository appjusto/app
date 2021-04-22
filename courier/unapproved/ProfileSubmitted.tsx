import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../common/app/context';
import { IconMotocycle } from '../../common/icons/icon-motocycle';
import { useSegmentScreen } from '../../common/store/api/track';
import { getCourier } from '../../common/store/courier/selectors';
import { colors, padding, screens, texts } from '../../common/styles';
import { t } from '../../strings';
import { UnapprovedParamList } from './types';

type ScreenNavigationProp = StackNavigationProp<UnapprovedParamList, 'ProfileSubmitted'>;
type ScreenRouteProp = RouteProp<UnapprovedParamList, 'ProfileSubmitted'>;

type Props = {
  navigation: ScreenNavigationProp;
  route: ScreenRouteProp;
};

export default function ({ navigation }: Props) {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const courier = useSelector(getCourier)!;
  // side effects
  // tracking
  useSegmentScreen('Profile Submitted');
  // adapting to situation changes
  React.useEffect(() => {
    if (courier.situation === 'submitted') {
      // api.courier().verifyProfile();
    } else if (courier.situation === 'pending') {
      setTimeout(() => {
        navigation.replace('ProfilePending');
      }, 100);
    } else if (courier.situation === 'rejected') {
      setTimeout(() => {
        navigation.replace('ProfileRejected');
      }, 100);
    }
  }, [courier, navigation, api]);
  // UI
  return (
    <SafeAreaView style={{ ...screens.config }}>
      <ScrollView>
        <View>
          <View
            style={{
              backgroundColor: colors.green500,
              paddingHorizontal: padding,
              paddingTop: 32,
            }}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <IconMotocycle circleColor={colors.white} />
              <Text style={{ ...texts.x2l, marginTop: 32 }}>{t('Cadastro enviado!')}</Text>
              <Text style={{ ...texts.md, marginTop: 32 }}>
                {t(
                  'Estamos analisando as informações enviadas. Em breve você poderá começar a fazer suas entregas. Avisaremos quando a sua conta for aprovada.'
                )}
              </Text>
              <Text style={{ ...texts.md, marginTop: 32, marginBottom: 48 }}>
                {t('Enquanto isso, aproveite para conhecer mais sobre o AppJusto:')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>

    //   <FeedbackView
    //     header={t('Cadastro enviado')}
    //     description={t(
    //       'Estamos analisando seus dados. Em breve você poderá começar a fazer suas entregas. Aguarde sua conta ser aprovada para continuar.'
    //     )}
    //     icon={<IconMotocycle circleColor={colors.yellow} />}
    //   />
  );
}
