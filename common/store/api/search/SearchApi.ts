import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch/lite';
import { Business, Fleet, Product } from 'appjusto-types';
import { LatLng } from 'react-native-maps';
import { AlgoliaConfig } from '../../../utils/config';
import { SearchParam } from '../../consumer/types';

export default class SearchApi {
  private client: SearchClient;
  private fleets: SearchIndex;
  private restaurants: SearchIndex;
  private products: SearchIndex;

  constructor(config: AlgoliaConfig) {
    this.client = algoliasearch(config.appId, config.apiKey);
    this.fleets = this.client.initIndex(`${config.env}_fleets`);
    this.restaurants = this.client.initIndex(`${config.env}_businesses`);
    this.products = this.client.initIndex(`${config.env}_products`);
  }

  private createFilters(filters?: SearchParam[]) {
    return filters
      ?.reduce<string[]>((result, param) => {
        if (param.kind === 'restaurant') {
          if (param.type === 'category') {
            return [...result, `cuisine.name: ${param.value}`];
          } else if (param.type === 'order') {
            if (param.value === 'price') {
              return [...result, 'statistics.averageTicketPrice > 0'];
            } else if (param.value === 'preparation-time') {
              return [...result, 'statistics.averagePreparationTime > 0'];
            } else if (param.value === 'popularity') {
              return [...result, 'statistics.totalOrders > 0'];
            }
          }
        } else if (param.kind === 'product') {
          if (param.type === 'order') {
            if (param.value === 'price') {
              return [...result, `price > 0`];
            } else if (param.value === 'popularity') {
              return [...result, `statistics.totalSold > 0`];
            }
          } else if (param.type === 'classification') {
            return [...result, `classification: ${param.value}`];
          }
        }
        return result;
      }, [])
      .join(' AND ');
  }

  searchRestaurants(
    aroundLocation: LatLng,
    query: string = '',
    filters?: SearchParam[],
    page?: number
  ) {
    console.log('searchRestaurants');
    console.log(filters);
    console.log(this.createFilters(filters));
    return this.restaurants.search<Business>(query, {
      aroundLatLng: `${aroundLocation.latitude}, ${aroundLocation.longitude}`,
      page,
      filters: this.createFilters(filters),
    });
  }

  searchProducts(
    aroundLocation: LatLng,
    query: string = '',
    filters?: SearchParam[],
    page?: number
  ) {
    console.log('searchProducts');
    console.log(filters);
    console.log(this.createFilters(filters));
    return this.products.search<Product>(query, {
      aroundLatLng: `${aroundLocation.latitude}, ${aroundLocation.longitude}`,
      page,
      filters: this.createFilters(filters),
    });
  }

  searchFleets(query: string = '', page?: number) {
    return this.fleets.search<Fleet>(query, {
      page,
    });
  }
}
