export type ToastType = 'success' | 'error';

export interface ToastState {
  message?: string;
  type?: ToastType;
  autoHide?: boolean;
}

export interface UIState {
  toast: ToastState;
  busy: boolean;
}
