import { Fleet } from '@appjusto/types';
import React from 'react';
import { Share, Text, TouchableOpacity, View } from 'react-native';
import DefaultButton from '../../../../../../common/components/buttons/DefaultButton';
import PaddedView from '../../../../../../common/components/containers/PaddedView';
import RoundedText from '../../../../../../common/components/texts/RoundedText';
import { IconShare } from '../../../../../../common/icons/icon-share';
import HomeCard from '../../../../../../common/screens/home/cards/HomeCard';
import { borders, colors, halfPadding, padding, texts } from '../../../../../../common/styles';
import { formatCurrency, formatDistance } from '../../../../../../common/utils/formatters';
import { t } from '../../../../../../strings';
import { AppJustoSiteURL } from '../../../../../../strings/values';

type Props = {
  fleet: Fleet;
  listItem?: boolean;
  onPress?: () => void;
};

export const CourierFleetCard = ({ fleet, listItem, onPress }: Props) => {
  const shareFleetHandler = React.useCallback(() => {
    //this needs the deeplinks Italo appointed in the backlog (notion)
    try {
      Share.share({
        message: `Eu faço parte da ${fleet.name} no AppJusto, app criado para combater a exploração dos entregadores. Faça parte dessa frota também!`,
        title: 'AppJusto',
        url: AppJustoSiteURL,
      });
    } catch (error) {}
  }, []);
  return (
    <PaddedView
      style={{
        ...borders.default,
        backgroundColor: colors.white,
      }}
    >
      <Text style={{ ...texts.sm }}>{fleet.name}</Text>
      <Text style={{ ...texts.xs, marginTop: halfPadding, color: colors.green600 }}>
        {fleet.participantsOnline} {t('participantes online')}
      </Text>
      <Text
        style={{
          ...texts.xs,
          marginTop: padding,
          color: colors.grey700,
          marginBottom: padding,
        }}
      >
        {fleet.description}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Text style={{ ...texts.xs }}>{t('Pagamento Mínimo')}</Text>
        <RoundedText>{formatCurrency(fleet.minimumFee)}</RoundedText>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Text style={{ ...texts.xs }}>{t('Distância Inicial Mínima')}</Text>
        <RoundedText>{formatDistance(fleet.distanceThreshold)}</RoundedText>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Text style={{ ...texts.xs }}>{t('Valor Adicional por Km rodado')}</Text>
        <RoundedText>{formatCurrency(fleet.additionalPerKmAfterThreshold)}</RoundedText>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Text style={{ ...texts.xs, color: colors.grey700 }}>
          {t('Distância Máxima para Entrega')}
        </Text>
        <RoundedText color={colors.grey700} backgroundColor={colors.grey50} noBorder>
          {formatDistance(fleet.maxDistance)}
        </RoundedText>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ ...texts.xs, color: colors.grey700 }}>
          {t('Distância Máxima até a Origem')}
        </Text>
        <RoundedText color={colors.grey700} backgroundColor={colors.grey50} noBorder>
          {formatDistance(fleet.maxDistanceToOrigin)}
        </RoundedText>
      </View>
      {/* <View style={{ paddingTop: padding }}>
        <TouchableOpacity onPress={shareFleetHandler}>
          <HomeCard
            icon={<IconShare />}
            title={t('Compartilhar frota')}
            subtitle={t('Divulgue para os seus amigos e os faça participar dessa frota')}
          />
        </TouchableOpacity>
      </View> */}
      {listItem ? (
        <DefaultButton
          title={t('Detalhes da frota')}
          secondary
          style={{ marginTop: padding }}
          onPress={onPress}
        />
      ) : (
        <View style={{ paddingTop: padding }}>
          <TouchableOpacity onPress={shareFleetHandler}>
            <HomeCard
              icon={<IconShare />}
              title={t('Compartilhar frota')}
              subtitle={t('Divulgue para os seus amigos e os faça participar dessa frota')}
            />
          </TouchableOpacity>
        </View>
      )}
    </PaddedView>
  );
};
