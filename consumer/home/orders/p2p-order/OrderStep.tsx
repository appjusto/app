import React, { useEffect, useState } from 'react';
import { Image, LayoutAnimation, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as icons from '../../../../assets/icons';
import { colors, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { Step } from './types';

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
  step: Step;
  changeStepHandler: (newStep: Step) => void;
};

export default function ({ step, changeStepHandler }: Props) {
  const [justifyContent, setJustifyContent] = useState<JustifyContent | null>(null);
  useEffect(() => {
    // to avoid initial animation
    if (justifyContent !== null) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    if (step === Step.Origin) setJustifyContent('flex-start');
    else if (step === Step.Destination) setJustifyContent('center');
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
        <TouchableOpacity onPress={() => changeStepHandler(Step.Origin)}>
          <Label text={t('Retirada')} active={step === Step.Origin} />
        </TouchableOpacity>
        <SeparatorLine />
        <TouchableOpacity onPress={() => changeStepHandler(Step.Destination)}>
          <Label text={t('Entrega')} active={step === Step.Destination} />
        </TouchableOpacity>
        <SeparatorLine />
        <TouchableOpacity onPress={() => changeStepHandler(Step.Confirmation)}>
          <Label text={t('Confirmação')} active={step === Step.Confirmation} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
