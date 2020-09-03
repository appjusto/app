import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import Courier from './types/Courier';

export const SET_LOCATION = 'SET_LOCATION';

export const updateCourierLocation = (api: Api) => (courier: Courier, location) => (
  dispatch: AppDispatch
) => {
  api.courier().updateCourierLocation(courier, location);
  dispatch({ type: SET_LOCATION, payload: location });
};

export const uploadProfileImages = (api: Api) => (
  courierId: string,
  selfieUri: string,
  documentUri: string,
  progressHandler: (progress: number) => void
) => async (dispatch: AppDispatch) => {
  const selfiePath = `couriers/${courierId}/selfie.jpg`;
  const documentPath = `couriers/${courierId}/document.jpg`;

  let selfieProgress = 0;
  let documentProgress = 0;
  let totalProgress = 0;

  const { task: selfieUploadTask } = await api.files().upload(selfiePath, selfieUri);
  selfieUploadTask.on(
    'state_changed',
    (snapshot) => {
      selfieProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      totalProgress = Math.floor((selfieProgress + documentProgress) / 2);
      progressHandler(totalProgress);
    },
    (error) => {
      console.error(error);
    },
    async () => {
      const downloadURL = await selfieUploadTask.snapshot.ref.getDownloadURL();
      console.log(downloadURL);
    }
  );

  const { task: documentUploadTask } = await api.files().upload(documentPath, documentUri);
  documentUploadTask.on(
    'state_changed',
    (snapshot) => {
      documentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      totalProgress = Math.floor((selfieProgress + documentProgress) / 2);
      progressHandler(totalProgress);
    },
    (error) => {
      console.error(error);
    },
    async () => {
      const downloadURL = await selfieUploadTask.snapshot.ref.getDownloadURL();
      console.log(downloadURL);
    }
  );
};
