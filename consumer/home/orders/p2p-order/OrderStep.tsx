import React, { useState, useEffect } from 'react';
import { View, Image, Text, LayoutAnimation } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import * as icons from '../../../../assets/icons';
import { colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { Steps } from './types';

type JustifyContent = 'flex-end' | 'flex-start' | 'center';

const labelWidth = 100;
const iconWidth = 32;

type LabelProps = {
  text: string;
  active: boolean;
};

function Label({ text, active }: LabelProps) {
  const color = active ? colors.black : colors.grey;
  return (
    <Text
      style={{
        ...texts.medium,
        color,
        // width: labelWidth,
        textAlign: 'center',
      }}
    >
      {text}
    </Text>
  );
}

function SeparatorLine() {
  return (
    <View
      style={{
        backgroundColor: colors.black,
        height: 1,
        flex: 1,
        marginHorizontal: padding,
      }}
    />
  );
}

type Props = {
  step: Steps;
  changeStepHandler: (newStep: Steps) => void;
};

export default function ({ step, changeStepHandler }: Props) {
  const [justifyContent, setJustifyContent] = useState<JustifyContent | null>(null);
  useEffect(() => {
    // to avoid initial animation
    if (justifyContent !== null) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    if (step === Steps.Origin) setJustifyContent('flex-start');
    else if (step === Steps.Destination) setJustifyContent('center');
    else setJustifyContent('flex-end');
  }, [step]);

  if (!justifyContent) return null;

  return (
    <View style={{ marginVertical: padding }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent,
          marginHorizontal: (labelWidth - iconWidth) * 0.5,
        }}
      >
        <Image source={icons.pinPackageWhite} style={{ width: iconWidth, height: 40 }} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: padding,
        }}
      >
        <TouchableOpacity onPress={() => changeStepHandler(Steps.Origin)}>
          <Label text={t('Retirada')} active={step === Steps.Origin} />
        </TouchableOpacity>
        <SeparatorLine />
        <TouchableOpacity onPress={() => changeStepHandler(Steps.Destination)}>
          <Label text={t('Entrega')} active={step === Steps.Destination} />
        </TouchableOpacity>
        <SeparatorLine />
        <TouchableOpacity onPress={() => changeStepHandler(Steps.Confirmation)}>
          <Label text={t('Confirmação')} active={step === Steps.Confirmation} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
