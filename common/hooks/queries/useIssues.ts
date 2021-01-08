import { IssueType } from 'appjusto-types';
import { useContext } from 'react';
import { useQuery } from 'react-query';
import { ApiContext } from '../../app/context';

export default function (type: IssueType) {
  const api = useContext(ApiContext);
  return useQuery(['issues', type], () => api.order().fetchIssues(type));
}
