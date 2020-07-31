export interface ConfigState {
  flavor: 'consumer' | 'courier' | 'admin';
  extra: object;
  env: 'development' | 'production';
}
