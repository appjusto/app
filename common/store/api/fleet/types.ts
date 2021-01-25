import { FirebaseDocument } from '../types';

export type ObserveFleetOptions = {
  fleetsIds: string[];
  limit?: number;
  startAfter?: FirebaseDocument;
};
