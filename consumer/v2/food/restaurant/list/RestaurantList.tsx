import { BusinessAlgolia } from '@appjusto/types';
import React from 'react';
import {
  ActivityIndicator,
  SectionList,
  SectionListProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { ApiContext } from '../../../../../common/app/context';
import DoubleHeader from '../../../../../common/components/texts/DoubleHeader';
import FeedbackView from '../../../../../common/components/views/FeedbackView';
import { IconConeYellow } from '../../../../../common/icons/icon-cone-yellow';
import { distanceBetweenLatLng } from '../../../../../common/store/api/helpers';
// import { distanceBetweenLatLng } from '../../../../common/store/api/helpers';
import { getCurrentLocation } from '../../../../../common/store/consumer/selectors';
import { colors, halfPadding, padding, screens } from '../../../../../common/styles';
import { t } from '../../../../../strings';
import { RestaurantListItem } from './RestaurantListItem';
import { RestaurantListSection } from './types';

interface Props extends SectionListProps<BusinessAlgolia, RestaurantListSection> {
  loading?: boolean;
  onSelect: (id: string) => void;
}

export const RestaurantList = ({ sections, loading, onSelect, ...props }: Props) => {
  // context
  const api = React.useContext(ApiContext);
  // redux
  const location = useSelector(getCurrentLocation);
  // UI
  return (
    <SectionList
      style={{ ...screens.default, paddingBottom: padding }}
      ListEmptyComponent={
        loading ? (
          <View style={{ ...screens.centered, marginTop: padding }}>
            <ActivityIndicator size="small" color={colors.green500} />
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
      renderSectionHeader={({ section }) => (
        <View style={{ marginBottom: padding }}>
          <DoubleHeader
            title={section.title}
            subtitle={section.subtitle}
            secondary={section.data.find(() => true)?.status === 'closed'}
          />
        </View>
      )}
      sections={sections}
      keyExtractor={(item) => item.objectID}
      renderItem={({ item, section }) => (
        <View style={{ marginTop: halfPadding }}>
          <TouchableOpacity onPress={() => onSelect(item.objectID)}>
            <RestaurantListItem
              restaurant={item}
              // cuisine={findCuisineById(item.cuisine)?.name}
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
      )}
      stickySectionHeadersEnabled={false}
      onRefresh={() => api.search().clearCache()}
      {...props}
    />
  );
};
