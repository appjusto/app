import { ReactElement } from 'react';

export interface Props {
  test: boolean;
  children: () => ReactElement;
}

export default function ({ test, children }: Props) {
  if (test) return children();
  return null;
}
