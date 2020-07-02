import firebase from 'firebase';
import 'firebase/firestore';
import { getExtra } from '../app.config';

const extra = getExtra();
firebase.initializeApp(extra.firebase);
const db = firebase.firestore();

export const broadcastLocation = (location) => {
  const { coords } = location;
  console.log('Saving location: ', coords)
  return db.collection('locations').add(coords);
};