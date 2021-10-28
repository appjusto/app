import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import LabeledText from '../../../common/components/texts/LabeledText';
import { screens } from '../../../common/styles';
import { t } from '../../../strings';

export const ChangeRoute = () => {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll
      keyboardOpeningTime={0}
      style={{ ...screens.config }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <PaddedView style={{ flex: 1 }}>
        {/* <Text style={{ ...texts.x2l }}>{t('Indique um restaurante')}</Text>
        <Text style={{ ...texts.sm, paddingTop: halfPadding, color: colors.grey700 }}>
          {t(
            'Estamos em constante expansão e queremos conhecer os seus restaurantes preferidos! Manda pra gente e vamos entrar em contato com eles.'
          )}
        </Text> */}
        <View style={{ marginTop: 32, flex: 1 }}>
          <TouchableOpacity onPress={() => null}>
            <LabeledText
              title={t('Novo endereço de entrega')}
              placeholder={t('Endereço com número')}
              style={{ height: 54 }}
            >
              {/* {name} */}
            </LabeledText>
          </TouchableOpacity>
          {/* <DefaultInput
            ref={instagramRef}
            style={{ marginTop: 12 }}
            title={t('Instagram (se souber)')}
            placeholder={t('Se souber o Instagram, conta pra gente')}
            value={instagram}
            returnKeyType="next"
            blurOnSubmit={false}
            onChangeText={(text) => setInstagram(text)}
            onSubmitEditing={() => phoneRef.current?.focus()}
            keyboardType="default"
          /> */}
        </View>
        <View style={{ flex: 1 }} />
        <DefaultButton
          title={t('Alterar endereço')}
          onPress={() => null}
          // disabled={!place}
          // activityIndicator={isLoading}
        />
      </PaddedView>
    </KeyboardAwareScrollView>
  );
};
