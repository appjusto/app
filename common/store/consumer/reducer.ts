import { ConsumerProfile, WithId } from 'appjusto-types';
import { AnyAction } from 'redux';
import { CONSUMER_PROFILE_UPDATED, USER_LOGGED_OUT } from '../user/actions';
import {
  ADD_PRODUCT_SEARCH_PARAM,
  ADD_RESTAURANT_SEARCH_PARAM,
  REMOVE_PRODUCT_SEARCH_PARAM,
  REMOVE_RESTAURANT_SEARCH_PARAM,
  UPDATE_CURRENT_LOCATION,
  UPDATE_CURRENT_PLACE,
  UPDATE_SEARCH_KIND,
} from './actions';
import { ConsumerState, SearchParam } from './types';

const initialState: ConsumerState = {
  searchKind: { type: 'kind', value: 'restaurant' },
  restaurantsSearchParams: [
    { type: 'order', kind: 'restaurant', value: 'preparation-time' },
    // { type: 'category', kind: 'restaurant', value: 'Japonês' },
  ],
  productSearchParameters: [{ type: 'order', kind: 'product', value: 'distance' }],
};

export default function (state: ConsumerState = initialState, action: AnyAction): ConsumerState {
  const { type, payload } = action;
  switch (type) {
    case CONSUMER_PROFILE_UPDATED: {
      const consumer = Object.assign({}, state.consumer, payload) as WithId<ConsumerProfile>;
      return { ...state, consumer };
    }
    case USER_LOGGED_OUT: {
      return { ...state, consumer: undefined };
    }
    case UPDATE_CURRENT_LOCATION: {
      return { ...state, currentLocation: action.payload };
    }
    case UPDATE_CURRENT_PLACE: {
      return { ...state, currentPlace: action.payload };
    }
    case UPDATE_SEARCH_KIND: {
      return { ...state, searchKind: action.payload };
    }
    case ADD_PRODUCT_SEARCH_PARAM:
    case ADD_RESTAURANT_SEARCH_PARAM: {
      const param = payload as SearchParam;
      let searchParams =
        type === ADD_RESTAURANT_SEARCH_PARAM
          ? state.restaurantsSearchParams
          : state.productSearchParameters;
      if (param.type === 'order') {
        // cannot have more than one order param
        searchParams = searchParams.filter((param) => param.type !== 'order');
      }
      searchParams = [...searchParams, param];
      return {
        ...state,
        [type === ADD_RESTAURANT_SEARCH_PARAM
          ? 'restaurantsSearchParams'
          : 'productSearchParameters']: searchParams,
      };
    }
    case REMOVE_PRODUCT_SEARCH_PARAM:
    case REMOVE_RESTAURANT_SEARCH_PARAM: {
      const param = payload as SearchParam;
      let searchParams =
        type === ADD_RESTAURANT_SEARCH_PARAM
          ? state.restaurantsSearchParams
          : state.productSearchParameters;
      // must have at least one order param
      if (param.type !== 'order') {
        searchParams = searchParams.filter(
          (p) => !(p.type === param.type && p.value === param.value)
        );
      }
      return {
        ...state,
        [type === ADD_RESTAURANT_SEARCH_PARAM
          ? 'restaurantsSearchParams'
          : 'productSearchParameters']: searchParams,
      };
    }
    default:
      return state;
  }
}
