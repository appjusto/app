import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export interface UserState {
  user?: FirebaseAuthTypes.User | null;
}
