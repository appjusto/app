import { WithId } from '@appjusto/types';
import {
  DocumentData,
  DocumentSnapshot,
  getDocs,
  limit,
  query,
  Query,
  startAfter,
} from 'firebase/firestore';
import React from 'react';
import { documentsAs } from '../types';

export const usePaging = <T extends object>(q: Query<DocumentData>, pageSize: number = 20) => {
  // refs
  const queryRef = React.useRef(q);
  // state
  const [isLoading, setLoading] = React.useState(true);
  const [searchAfterDoc, setSearchAfterDoc] = React.useState<DocumentSnapshot | null>(null);
  const [lastDocument, setLastDocument] = React.useState<DocumentSnapshot | null>(null);
  const [resultsByLastDoc, setResultsByLastDoc] = React.useState<
    Map<DocumentSnapshot | null, DocumentSnapshot[]>
  >(new Map());
  // side effects
  React.useEffect(() => {
    (async () => {
      const constraints = [limit(pageSize)];
      if (searchAfterDoc) constraints.push(startAfter(searchAfterDoc));
      setLoading(true);
      const result = await getDocs(query(queryRef.current, ...constraints));
      const docs = result.docs;
      const last =
        docs
          .slice()
          .reverse()
          .find(() => true) ?? null;
      setLastDocument(lastDocument ?? null);
      setResultsByLastDoc((current) => {
        const value = new Map(current.entries());
        value.set(last, docs);
        return value;
      });
      setLoading(false);
    })();
  }, [searchAfterDoc]);
  // results
  const results = Array.from(resultsByLastDoc.values()).reduce(
    (result, page) => [...result, ...documentsAs<T>(page)],
    [] as WithId<T>[]
  );
  const fetchNextPage = () => {
    if (lastDocument) {
      setSearchAfterDoc(lastDocument);
      return true;
    }
    return false;
  };
  return { results, isLoading, fetchNextPage };
};
