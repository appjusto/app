export type NestedNavigatorParams<ParamList> = {
  [K in keyof ParamList]: undefined extends ParamList[K]
    ? { screen: K; params?: ParamList[K]; initial?: boolean }
    : { screen: K; params: ParamList[K]; initial?: boolean };
}[keyof ParamList];
