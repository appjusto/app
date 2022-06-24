import React from 'react';
import { ToastType } from '../store/ui/types';

type ModalToastConfigType = { type: ToastType; message: string; duration: number };

type ToastContextType = {
  modalToastConfig: ModalToastConfigType | null;
  showModalToast: (message: string, type: ToastType, duration?: number) => void;
  hideModalToast: () => void;
};

export const ModalToastContext = React.createContext<ToastContextType>({} as ToastContextType);

export const ModalToastProvider: React.FC = ({ children }) => {
  const [modalToastConfig, setModalToastConfig] = React.useState<ModalToastConfigType | null>(null);

  const showModalToast = (message: string, type: ToastType, duration = 4000) => {
    setModalToastConfig({ type, message, duration });
  };

  const hideModalToast = () => {
    setModalToastConfig(null);
  };

  return (
    <ModalToastContext.Provider value={{ modalToastConfig, showModalToast, hideModalToast }}>
      {children}
    </ModalToastContext.Provider>
  );
};

export const useModalToastContext = () => {
  return React.useContext(ModalToastContext);
};
