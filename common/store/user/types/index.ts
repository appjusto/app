import { User } from 'firebase/auth';

export interface UserState {
  user?: User | null;
}
