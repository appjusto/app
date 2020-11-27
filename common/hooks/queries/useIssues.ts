import { IssueType } from 'appjusto-types/order';
import { useContext } from 'react';
import { useQuery } from 'react-query';

import { ApiContext } from '../../app/context';

export default function (type: string) {
  const api = useContext(ApiContext);
  const fetchIssues = (key: string, type: IssueType) => api.order().fetchIssues(type);
  return useQuery(['issues', type], fetchIssues);
}
