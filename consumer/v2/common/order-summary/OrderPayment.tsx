import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultButton from '../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../common/components/texts/RoundedText';
import { getPaymentMethodById } from '../../../../common/store/api/business/consumer/selectors';
import { useIsPixEnabled } from '../../../../common/store/api/order/ui/useIsPixEnabled';
import { useProfileSummary } from '../../../../common/store/api/profile/useProfileSummary';
import { getConsumer } from '../../../../common/store/consumer/selectors';
import { borders, colors, halfPadding, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';
import { PixCard } from '../PixCard';

interface Props {
  selectedPaymentMethodId?: string;
  isSubmitEnabled: boolean;
  activityIndicator: boolean;
  onEditPaymentMethod: () => void;
  onSubmit: () => void;
  navigateToAboutCharges: () => void;
  navigateToPayWithPix: () => void;
  navigateToCompleteProfile: () => void;
  navigateToSelectPayment: () => void;
}

export const OrderPayment = ({
  selectedPaymentMethodId,
  isSubmitEnabled,
  activityIndicator,
  onEditPaymentMethod,
  onSubmit,
  navigateToAboutCharges,
  navigateToPayWithPix,
  navigateToCompleteProfile,
  navigateToSelectPayment,
}: Props) => {
  // redux
  const consumer = useSelector(getConsumer)!;
  // helpers
  const payableWithPix = useIsPixEnabled();
  const { isProfileComplete, shouldVerifyPhone } = useProfileSummary();
  const selectedPaymentMethod = getPaymentMethodById(consumer, selectedPaymentMethodId);
  // delete this after
  const [interfaceNew, setInterfaceNew] = React.useState(true);
  return !interfaceNew ? (
    <View>
      {/* <View style={{ marginTop: padding }}>
        <SingleHeader title={t('Forma de pagamento')} />
      </View> */}
      <PaddedView>
        {Boolean(!selectedPaymentMethod) ? (
          <View style={{ marginBottom: padding }}>
            <TouchableOpacity onPress={navigateToPayWithPix}>
              <PixCard />
            </TouchableOpacity>
          </View>
        ) : null}
        {Boolean(selectedPaymentMethod) ? (
          <View style={{ marginBottom: halfPadding }}>
            <TouchableOpacity onPress={onEditPaymentMethod}>
              <View style={{ marginBottom: halfPadding }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ ...texts.md }}>{t('Forma de pagamento')}</Text>
                  <Feather
                    name="edit-3"
                    size={12}
                    style={{ ...borders.default, borderColor: colors.grey50, padding: 8 }}
                  />
                </View>
                <Text style={{ ...texts.sm, color: colors.grey700 }}>
                  {`${t('Cartão de crédito')}: ${selectedPaymentMethod!.data.display_number}`}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: halfPadding }} onPress={navigateToAboutCharges}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="info" size={14} />
                <Text
                  style={{ ...texts.xs, marginLeft: halfPadding, textDecorationLine: 'underline' }}
                >
                  {t('O valor total pode ser dividido em duas cobranças. Clique para saber mais')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}

        {isProfileComplete && selectedPaymentMethod ? (
          <DefaultButton
            title={shouldVerifyPhone ? t('Verificar telefone') : t('Confirmar pedido')}
            onPress={onSubmit}
            disabled={!isSubmitEnabled}
            activityIndicator={activityIndicator}
            style={{ marginTop: padding }}
          />
        ) : (
          <DefaultButton
            title={
              !isProfileComplete ? t('Completar cadastro') : t('Escolher uma forma de pagamento')
            }
            onPress={onEditPaymentMethod}
            variant="secondary"
            style={{ marginTop: padding }}
          />
        )}

        {payableWithPix ? (
          <DefaultButton
            variant="secondary"
            title={t('Quero pagar com Pix')}
            style={{ marginVertical: padding }}
            onPress={navigateToPayWithPix}
          >
            <RoundedText backgroundColor={colors.darkYellow} style={{ right: -64 }}>
              {t('Novo!')}
            </RoundedText>
          </DefaultButton>
        ) : null}
      </PaddedView>
    </View>
  ) : (
    <PaddedView>
      {!isProfileComplete || shouldVerifyPhone ? (
        <DefaultButton
          variant="secondary"
          title={t('Completar cadastro')}
          style={{ marginVertical: padding }}
          onPress={navigateToCompleteProfile}
        />
      ) : (
        <DefaultButton
          variant="secondary"
          title={t('Escolher forma de pagamento')}
          style={{ marginVertical: padding }}
          onPress={navigateToSelectPayment}
        />
      )}
    </PaddedView>
  );
};
