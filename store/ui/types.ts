export interface ToastState {
  message: string | null;
  type?: 'success' | 'error';
  autoHide?: boolean;
}

export interface UIState {
  toast: ToastState;
  blockUI: boolean;
}
