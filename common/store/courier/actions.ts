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
