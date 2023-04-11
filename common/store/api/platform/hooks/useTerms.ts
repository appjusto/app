import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { parse } from 'marked';
import React from 'react';
import { useSelector } from 'react-redux';
import * as terms from '../../../../data/terms';
import { getFlavor } from '../../../config/selectors';

export const useTerms = () => {
  // redux
  const flavor = useSelector(getFlavor);
  const embedTerms =
    flavor === 'courier' ? terms.courier : flavor === 'consumer' ? terms.consumer : terms.business;
  const url =
    flavor === 'courier'
      ? 'https://raw.githubusercontent.com/appjusto/docs/main/legal/termos-de-uso-entregadores.md'
      : flavor === 'consumer'
      ? 'https://raw.githubusercontent.com/appjusto/docs/main/legal/termos-de-uso-consumidores.md'
      : 'https://raw.githubusercontent.com/appjusto/docs/main/legal/termos-de-uso-restaurantes.md';
  // state
  const [unformattedTerms, setUnformattedTerms] = React.useState<string>();
  const [formattedTerms, setFormattedTerms] = React.useState<string>();
  // side effects
  const query = useQuery(['terms', flavor], () => axios.get<string>(url));
  React.useEffect(() => {
    if (query.data?.data) setUnformattedTerms(query.data.data);
    else if (query.isError) setUnformattedTerms(embedTerms);
  }, [query, embedTerms]);
  React.useEffect(() => {
    if (unformattedTerms) setFormattedTerms(parse(unformattedTerms));
  }, [unformattedTerms]);
  // result
  return formattedTerms;
};
