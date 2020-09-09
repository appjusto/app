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

export const uploadSelfie = (api: Api) => (
  courierId: string,
  selfieUri: string,
  progressHandler?: (progress: number) => void
) => async (dispatch: AppDispatch) => {
  const selfiePath = `couriers/${courierId}/selfie.jpg`;
  return api.files().upload(selfiePath, selfieUri, progressHandler);
};

export const uploadDocumentImage = (api: Api) => (
  courierId: string,
  documentUri: string,
  progressHandler?: (progress: number) => void
) => async (dispatch: AppDispatch) => {
  const documentPath = `couriers/${courierId}/document.jpg`;
  return api.files().upload(documentPath, documentUri, progressHandler);
};

export const uploadProfileImages = (api: Api) => (
  courierId: string,
  selfieUri?: string,
  documentUri?: string,
  progressHandler?: (progress: number) => void
) => async (dispatch: AppDispatch) => {
  let selfieProgress = 0;
  let documentProgress = 0;
  let totalProgress = 0;

  const updateProgress = () => {
    if (progressHandler) {
      totalProgress = Math.floor((selfieProgress + documentProgress) / 2);
      progressHandler(totalProgress);
    }
  };

  if (!selfieUri) selfieProgress = 100;
  else {
    const selfiePath = `couriers/${courierId}/selfie.jpg`;
    return api.files().upload(selfiePath, selfieUri, (progress: number) => {
      selfieProgress = progress;
      updateProgress();
    });
  }

  if (!documentUri) documentProgress = 100;
  else {
    const documentPath = `couriers/${courierId}/document.jpg`;
    return api.files().upload(documentPath, documentUri, (progress: number) => {
      documentProgress = progress;
      updateProgress();
    });
  }
};

export const getSelfieURL = (api: Api) => (courierId: string) => async (dispatch: AppDispatch) => {
  const selfiePath = `couriers/${courierId}/selfie_100x100.jpg`;
  return api.files().getDownloadURL(selfiePath);
};

export const getDocumentImageURL = (api: Api) => (courierId: string) => async (
  dispatch: AppDispatch
) => {
  const documentImagePath = `couriers/${courierId}/document_100x100.jpg`;
  return api.files().getDownloadURL(documentImagePath);
};
