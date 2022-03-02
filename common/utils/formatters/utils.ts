import { FieldValue, Timestamp } from 'firebase/firestore';

export const dateInput = (value: Date | FieldValue) =>
  value.constructor.name === 'Date' ? (value as Date) : (value as Timestamp).toDate();
