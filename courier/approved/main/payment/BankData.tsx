import { CourierProfile, WithId } from '@appjusto/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import PaddedView from '../../../../common/components/containers/PaddedView';
import SingleHeader from '../../../../common/components/texts/SingleHeader';
import HR from '../../../../common/components/views/HR';
import { colors, padding, texts } from '../../../../common/styles';
import { t } from '../../../../strings';

type Props = {
  courier: WithId<CourierProfile>;
  navigateToProfileBank: () => void;
};

export const BankData = ({ courier, navigateToProfileBank }: Props) => {
  return (
    <View>
      <SingleHeader title={t('Dados bancários')} />
      <Text
        style={{ ...texts.xs, color: colors.grey700, paddingHorizontal: padding, paddingTop: 12 }}
      >
        {t('Confirme seus dados bancários para transferência')}
      </Text>
      <PaddedView>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ ...texts.sm }}>{t('CNPJ')}</Text>
          <Text style={{ ...texts.sm }}>{courier.company?.cnpj}</Text>
        </View>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ ...texts.sm }}>{t('Banco')}</Text>
          <Text style={{ ...texts.sm }}>{courier.bankAccount?.name}</Text>
        </View>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ ...texts.sm }}>{t('Agência')}</Text>
          <Text style={{ ...texts.sm }}>{courier.bankAccount?.agencyFormatted}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 12,
          }}
        >
          <Text style={{ ...texts.sm }}>{t('Conta')}</Text>
          <Text style={{ ...texts.sm }}>{courier.bankAccount?.accountFormatted}</Text>
        </View>
        <HR />
        <TouchableOpacity style={{ paddingTop: 12 }} onPress={navigateToProfileBank}>
          <>
            <Text style={{ ...texts.sm, color: colors.green600 }}>
              {t('Alterar dados bancários')}
            </Text>
          </>
        </TouchableOpacity>
      </PaddedView>
    </View>
  );
};
