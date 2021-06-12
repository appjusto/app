import firebase from 'firebase';

export const dateInput = (value: Date | firebase.firestore.FieldValue) =>
  value.constructor.name === 'Date'
    ? (value as Date)
    : (value as firebase.firestore.Timestamp).toDate();
