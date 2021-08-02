import React from 'react';
import { Text, View } from 'react-native';
import { DispatchingState } from '../../../../types';
import DefaultButton from '../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../common/components/containers/PaddedView';
import SingleHeader from '../../../common/components/texts/SingleHeader';
import HR from '../../../common/components/views/HR';
import { halfPadding, padding, texts } from '../../../common/styles';
import { t } from '../../../strings';
import { CodeInput } from './code-input/CodeInput';

type Props = {
  code: string;
  onSetCode: (code: string) => void;
  buttonTitle: string;
  onDelivery: () => void;
  isLoading: boolean;
  onNoCodeDelivery: () => void;
  dispatchingState: DispatchingState | undefined;
};

export const OngoingDeliveryCode = ({
  code,
  onSetCode,
  buttonTitle,
  onDelivery,
  isLoading,
  onNoCodeDelivery,
  dispatchingState,
}: Props) => {
  return dispatchingState && dispatchingState === 'arrived-destination' ? (
    <View>
      <HR height={padding} />
      <View style={{ paddingBottom: halfPadding }}>
        <SingleHeader title={t('Código de confirmação')} />
        <View style={{ paddingHorizontal: padding }}>
          <Text style={{ ...texts.sm, marginBottom: padding }}>
            {t('Digite o código de confirmação fornecido pelo cliente:')}
          </Text>
          <CodeInput value={code} onChange={onSetCode} />
          <DefaultButton
            title={buttonTitle}
            onPress={onDelivery}
            activityIndicator={isLoading}
            disabled={isLoading || code.length < 3}
            style={{ marginTop: padding }}
          />
        </View>
      </View>
      <HR height={padding} />
      <PaddedView>
        <DefaultButton
          secondary
          title={t('Confirmar entrega sem código')}
          onPress={onNoCodeDelivery}
        />
      </PaddedView>
    </View>
  ) : null;
};
