export interface ToastState {
  message: string | null;
  type?: 'success' | 'error';
}

export interface UIState {
  toast: ToastState;
}
