import { Issue, IssueType } from '@appjusto/types';
import React, { useContext } from 'react';
import { ApiContext } from '../../../../app/context';

export default function (type: IssueType) {
  // context
  const api = useContext(ApiContext);
  // state
  const [issues, setIssues] = React.useState<Issue[]>();
  // side effects
  React.useEffect(() => {
    (async () => {
      setIssues(await api.platform().fetchIssues(type));
    })();
  }, [api, type]);
  return issues;
}
