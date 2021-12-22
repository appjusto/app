import { BusinessAlgolia } from '@appjusto/types';
import React from 'react';
import {
  ActivityIndicator,
  SectionList,
  SectionListProps,
  TouchableOpacity,
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../../common/app/context';
import PaddedView from '../../../../../common/components/containers/PaddedView';
import DoubleHeader from '../../../../../common/components/texts/DoubleHeader';
import FeedbackView from '../../../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../../../common/icons/icon-cone-yellow';
import { IconShareGreen } from '../../../../../common/icons/icon-share-green';
import HomeCard from '../../../../../common/screens/home/cards/HomeCard';
import { distanceBetweenLatLng } from '../../../../../common/store/api/helpers';
import { getCurrentLocation } from '../../../../../common/store/consumer/selectors';
import { colors, doublePadding, padding, screens } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { RestaurantListItem } from './RestaurantListItem';
import { RestaurantListSection } from './types';

interface Props extends SectionListProps<BusinessAlgolia, RestaurantListSection> {
  loading?: boolean;
  onSelect: (id: string) => void;
  onRecommend?: () => void;
}

export const RestaurantList = ({ sections, loading, onSelect, onRecommend, ...props }: Props) => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const location = useSelector(getCurrentLocation);
  // UI
  return (
    <SectionList
      keyboardShouldPersistTaps="handled"
      style={{ ...screens.default, paddingBottom: padding }}
      ListFooterComponent={
        loading ? null : (
          <View
            style={{
              height: doublePadding,
              backgroundColor: colors.grey50,
            }}
          />
        )
      }
      ListEmptyComponent={
        loading ? (
          <View style={{ ...screens.centered, marginTop: padding }}>
            <ActivityIndicator size="large" color={colors.green500} />
          </View>
        ) : (
          <FeedbackView
            description={t(
              'Não encontramos nenhum resultado para a sua busca. Refaça a pesquisa ou utilize filtros diferentes.'
            )}
            icon={<IconConeYellow />}
          />
        )
      }
      renderSectionHeader={({ section }) => {
        const closed = section.data.find(() => true)?.status === 'closed';
        return (
          <View>
            {closed ? (
              <PaddedView style={{ backgroundColor: colors.white }}>
                <TouchableOpacity onPress={onRecommend}>
                  <HomeCard
                    icon={<IconShareGreen />}
                    title={t('Indique um restaurante')}
                    subtitle={t(
                      'Ainda não encontrou o restaurante que queria por aqui? Manda pra gente!'
                    )}
                  />
                </TouchableOpacity>
              </PaddedView>
            ) : null}
            <View
              style={{
                paddingBottom: padding,
                backgroundColor: closed ? colors.grey50 : colors.white,
              }}
            >
              <DoubleHeader title={section.title} subtitle={section.subtitle} />
            </View>
          </View>
        );
      }}
      sections={sections}
      keyExtractor={(item) => item.objectID}
      renderItem={({ item, section }) => {
        const closed = section.data.find(() => true)?.status === 'closed';
        return (
          <View
            style={{
              backgroundColor: closed ? colors.grey50 : colors.white,
              paddingBottom: padding,
            }}
          >
            <TouchableOpacity onPress={() => onSelect(item.objectID)}>
              <RestaurantListItem
                id={item.objectID}
                restaurant={item}
                cuisine={item.cuisine}
                secondary={section.data.find(() => true)?.status === 'closed'}
                distance={
                  location && item.businessAddress?.latlng
                    ? distanceBetweenLatLng(location, item.businessAddress.latlng)
                    : undefined
                }
              />
            </TouchableOpacity>
          </View>
        );
      }}
      stickySectionHeadersEnabled={false}
      onRefresh={() => api.search().clearCache()}
      {...props}
    />
  );
};
