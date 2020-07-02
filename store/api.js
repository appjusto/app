import firebase from 'firebase';
import 'firebase/firestore';

export const config = (firebaseConfig) => {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();  
}

export const broadcastLocation = (location) => {
  if (!db) throw new Error('Firebase not configured. Call config before.')
  const { coords } = location;
  console.log('Saving location: ', coords)
  return db.collection('locations').add(coords);
};