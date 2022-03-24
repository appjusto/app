import axios from 'axios';
import { parse } from 'marked';
import React from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import * as terms from '../../../../data/terms';
import { getFlavor } from '../../../config/selectors';

export const useTerms = () => {
  // redux
  const flavor = useSelector(getFlavor);
  const embedTerms = flavor === 'courier' ? terms.courier : terms.consumer;
  const url =
    flavor === 'courier'
      ? 'https://raw.githubusercontent.com/appjusto/docs/main/legal/termos-de-uso-entregadores.md'
      : 'https://raw.githubusercontent.com/appjusto/docs/main/legal/termos-de-uso-consumidores.md';
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
