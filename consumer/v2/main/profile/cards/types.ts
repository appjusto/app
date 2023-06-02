export interface CardInfo {
  processor: 'vr' | 'iugu';
  name: string;
  number: string;
  month: string;
  year: string;
  cvv: string;
  hash?: string;
}
