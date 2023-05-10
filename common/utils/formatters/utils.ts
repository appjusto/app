import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export const dateInput = (value: Date | FirebaseFirestoreTypes.FieldValue) =>
  value.constructor.name === 'Date'
    ? (value as Date)
    : (value as FirebaseFirestoreTypes.Timestamp).toDate();
