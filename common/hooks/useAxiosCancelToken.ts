import axios, { CancelTokenSource } from 'axios';
import { useEffect, useState } from 'react';

export default function () {
  // state
  const [tokensSources, setTokenSources] = useState<CancelTokenSource[]>([]);
  // effects
  useEffect(() => {
    return () => {
      tokensSources.forEach((tokensSources) => tokensSources.cancel());
    };
  }, [tokensSources]);
  // returns
  return () => {
    const tokenSource = axios.CancelToken.source();
    setTokenSources([...tokensSources, tokenSource]);
    return tokenSource.token;
  };
}
