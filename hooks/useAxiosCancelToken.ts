import axios from 'axios';
import { useEffect, useState } from 'react';

export default function () {
  // state
  const [cancelTokenSource] = useState(axios.CancelToken.source());
  // effects
  useEffect(() => {
    return () => {
      cancelTokenSource.cancel();
    };
  }, []);
  // returns
  return cancelTokenSource.token;
}
