export interface CardInfo {
  processor: 'vr' | 'iugu' | 'braspag';
  name: string;
  number: string;
  month: string;
  year: string;
  cvv: string;
  hash?: string;
}
