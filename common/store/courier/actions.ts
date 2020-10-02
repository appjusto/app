import { AppDispatch } from '../../app/context';
import Api from '../api/api';
import * as viacep from '../api/externals/viacep';
import { awaitWithFeedback } from '../ui/actions';

export const UPDATE_BANKS = 'UPDATE_BANKS';

export const submitProfile = (api: Api) => async (dispatch: AppDispatch) => {
  return dispatch(awaitWithFeedback(api.courier().submitProfile()));
};

export const fetchBanks = (api: Api) => async (dispatch: AppDispatch) => {
  const banks = await dispatch(awaitWithFeedback(api.courier().fetchBanks()));
  dispatch({ type: UPDATE_BANKS, payload: banks });
};

export const fetchPostalDetails = (cep: string) => async (dispatch: AppDispatch) =>
  dispatch(awaitWithFeedback(viacep.fetchPostalDetails(cep)));

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
  const selfiePath = `couriers/${courierId}/selfie_160x160.jpg`;
  return api.files().getDownloadURL(selfiePath);
};

export const getDocumentImageURL = (api: Api) => (courierId: string) => async (
  dispatch: AppDispatch
) => {
  const documentImagePath = `couriers/${courierId}/document_160x160.jpg`;
  return api.files().getDownloadURL(documentImagePath);
};
